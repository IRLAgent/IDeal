'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface Conversation {
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
  car: Car | null;
}

export default function MessagesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    } else {
      setMounted(true);
      fetchMessages();
    }
  }, [router]);

  const fetchMessages = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await apiCallAuth('/messages', { method: 'GET' }, token);
      const messages = response as Message[];

      // Get current user ID from token (decode JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.userId);

      // Group messages into conversations
      const conversationMap = new Map<string, Conversation>();

      messages.forEach((message) => {
        const isFromMe = message.fromUserId === payload.userId;
        const otherUser = isFromMe ? message.toUser : message.fromUser;
        const key = otherUser.id;

        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            otherUser,
            lastMessage: message,
            unreadCount: 0,
            car: message.car,
          });
        }

        const conversation = conversationMap.get(key)!;
        // Update with most recent message
        if (new Date(message.createdAt) > new Date(conversation.lastMessage.createdAt)) {
          conversation.lastMessage = message;
        }

        // Count unread messages from other user
        if (!message.read && message.toUserId === payload.userId) {
          conversation.unreadCount++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {!mounted ? (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Messages</h1>
              <p className="text-gray-600 mt-2">Your conversations about cars</p>
            </div>
            <Link
              href="/dashboard"
              className="text-indigo-950 hover:text-indigo-900 font-semibold"
            >
              ← Back to Dashboard
            </Link>
          </div>

          {loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">Loading messages...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No messages yet</p>
              <Link
                href="/search"
                className="text-indigo-950 hover:text-indigo-900 font-semibold"
              >
                Browse cars to start a conversation
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              {conversations.map((conversation) => (
                <Link
                  key={conversation.otherUser.id}
                  href={`/messages/${conversation.otherUser.id}`}
                  className="block border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900">
                            {conversation.otherUser.name}
                          </h3>
                          {conversation.unreadCount > 0 && (
                            <span className="bg-indigo-950 text-white text-xs px-2 py-0.5 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                        {conversation.car && (
                          <p className="text-sm text-gray-500 mb-1">
                            About: {conversation.car.year} {conversation.car.make}{' '}
                            {conversation.car.model}
                          </p>
                        )}
                        <p
                          className={`text-sm ${
                            conversation.unreadCount > 0
                              ? 'font-semibold text-slate-900'
                              : 'text-gray-600'
                          } line-clamp-2`}
                        >
                          {conversation.lastMessage.fromUserId === currentUserId
                            ? 'You: '
                            : ''}
                          {conversation.lastMessage.messageText}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
                        {formatTime(conversation.lastMessage.createdAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
