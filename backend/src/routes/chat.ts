import express from 'express';
import { ChatController } from '../controllers/chat';

const router = express.Router();

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// POST /api/chat - Send a message to the chatbot
router.post('/', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const history: ChatMessage[] = Array.isArray(conversationHistory) 
      ? conversationHistory 
      : [];

    const result = await ChatController.processMessage(message, history);

    res.json(result);
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: "I'm having trouble right now. Please try again later.",
      cars: [],
      searchCriteria: {},
      totalMatches: 0,
    });
  }
});

export default router;
