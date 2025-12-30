import { PrismaClient } from '@prisma/client';
import { sendMessageNotification } from '../utils/email';

const prisma = new PrismaClient();

export class MessageController {
  static async sendMessage(
    fromUserId: string,
    toUserId: string,
    carId: string,
    messageText: string
  ) {
    const message = await prisma.message.create({
      data: {
        fromUserId,
        toUserId,
        carId,
        messageText,
      },
      include: { 
        fromUser: true, 
        toUser: true,
        car: true,
      },
    });

    // Send email notification (async, don't wait)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const conversationUrl = `${frontendUrl}/messages/${fromUserId}`;
    
    sendMessageNotification({
      toEmail: message.toUser.email,
      toName: message.toUser.name,
      fromName: message.fromUser.name,
      messageText: message.messageText,
      carTitle: message.car ? `${message.car.year} ${message.car.make} ${message.car.model}` : undefined,
      conversationUrl,
    }).catch(err => console.error('Email notification failed:', err));

    return message;
  }

  static async getConversation(userId: string, otherUserId: string) {
    return await prisma.message.findMany({
      where: {
        OR: [
          { fromUserId: userId, toUserId: otherUserId },
          { fromUserId: otherUserId, toUserId: userId },
        ],
      },
      include: { fromUser: true, toUser: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async getUserMessages(userId: string) {
    return await prisma.message.findMany({
      where: {
        OR: [{ fromUserId: userId }, { toUserId: userId }],
      },
      include: { fromUser: true, toUser: true, car: true },
      orderBy: { createdAt: 'desc' },
      distinct: ['fromUserId', 'toUserId'],
    });
  }

  static async markAsRead(messageId: string) {
    return await prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });
  }
}
