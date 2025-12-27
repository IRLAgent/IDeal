import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MessageController {
  static async sendMessage(
    fromUserId: string,
    toUserId: string,
    carId: string,
    messageText: string
  ) {
    return await prisma.message.create({
      data: {
        fromUserId,
        toUserId,
        carId,
        messageText,
      },
      include: { fromUser: true, toUser: true },
    });
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
