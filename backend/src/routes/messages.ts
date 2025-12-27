import { Router, Response } from 'express';
import { MessageController } from '../controllers/message';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();

// Send message
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { toUserId, carId, messageText } = req.body;

    if (!toUserId || !messageText) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = await MessageController.sendMessage(
      req.userId!,
      toUserId,
      carId,
      messageText
    );
    res.status(201).json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get user's messages
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await MessageController.getUserMessages(req.userId!);
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get conversation with specific user
router.get('/:otherUserId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const messages = await MessageController.getConversation(
      req.userId!,
      req.params.otherUserId
    );
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Mark message as read
router.patch('/:messageId/read', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const message = await MessageController.markAsRead(req.params.messageId);
    res.json(message);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
