'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { apiCallAuth } from '@/lib/api';
import { isAuthenticated, getAuthToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
}

interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  carId: string | null;
  messageText: string;
  read: boolean;
  createdAt: string;
  fromUser: User;
  toUser: User;
  car: Car | null;
}

export default function ConversationPage() {
  const router = useRouter();
  const params = useParams();
  const otherUserId = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    } else {
      setMounted(true);
      const token = getAuthToken();
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.userId);
      }
      fetchConversation();
    }
  }, [router, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await apiCallAuth(`/messages/${otherUserId}`, { method: 'GET' }, token);
      const messagesData = response as Message[];
      setMessages(messagesData);

      // Get other user info from first message
      if (messagesData.length > 0) {
        const firstMessage = messagesData[0];
        const payload = JSON.parse(atob(token.split('.')[1]));
        const other =
          firstMessage.fromUserId === payload.userId
            ? firstMessage.toUser
            : firstMessage.fromUser;
        setOtherUser(other);

        // Mark unread messages as read
        const unreadMessages = messagesData.filter(
          (msg: Message) => !msg.read && msg.toUserId === payload.userId
        );
        for (const msg of unreadMessages) {
          try {
            await apiCallAuth(
              `/messages/${msg.id}/read`,
              { method: 'PATCH' },
              token
            );
          } catch (error) {
            console.error('Failed to mark message as read:', error);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await apiCallAuth(
        '/messages',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            toUserId: otherUserId,
            messageText: newMessage.trim(),
            carId: null,
          }),
        },
        token
      );

      const newMsg = response as Message;
      setMessages([...messages, newMsg]);
      setNewMessage('');

      // Set other user if not already set
      if (!otherUser) {
        setOtherUser(newMsg.toUser);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {!mounted ? (
        <div className="flex items-center justify-center flex-1">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white border-b shadow-sm">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center gap-4">
                <Link
                  href="/messages"
                  className="text-indigo-950 hover:text-indigo-900 font-semibold"
                >
                  ← Back
                </Link>
                {otherUser && (
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">
                      {otherUser.name}
                    </h1>
                    <p className="text-sm text-gray-600">{otherUser.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 py-6">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading conversation...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isFromMe = message.fromUserId === currentUserId;
                    return (
                      <div
                        key={message.id}
                        className={`flex ${isFromMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-3 rounded-lg ${
                            isFromMe
                              ? 'bg-indigo-950 text-white'
                              : 'bg-white border border-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.messageText}
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isFromMe ? 'text-indigo-200' : 'text-gray-500'
                            }`}
                          >
                            {formatMessageTime(message.createdAt)}
                            {isFromMe && !message.read && ' • Sent'}
                            {isFromMe && message.read && ' • Read'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t shadow-lg">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="px-6 py-3 bg-indigo-950 text-white rounded-lg font-semibold hover:bg-indigo-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
