import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface SearchCriteria {
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  make?: string;
  model?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  location?: string;
}

export class ChatController {
  static async processMessage(message: string, conversationHistory: ChatMessage[] = []) {
    try {
      if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      // Build conversation context
      const conversationContext = conversationHistory
        .map((msg) => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // System prompt for the AI
      const systemPrompt = `You are a helpful car marketplace assistant for an Irish car marketplace. Your job is to help users find cars that match their needs.

Extract search criteria from the user's message and respond in JSON format with two fields:
1. "criteria": An object with search parameters
2. "response": A friendly message to the user

Search criteria fields (all optional):
- priceMax: number (in euros)
- yearMin: number (minimum year)
- yearMax: number (maximum year)
- make: string (car brand like "Toyota", "BMW", "Volkswagen")
- model: string (specific model)
- fuelType: string ("Petrol", "Diesel", "Electric", "Hybrid")
- transmission: string ("Manual", "Automatic")
- bodyType: string ("Sedan", "SUV", "Hatchback", "Estate", "Coupe", "Van")
- location: string (Irish county)

Context clues:
- "family car" / "kids" → SUV or Estate, 5+ seats
- "economical" / "cheap to run" → small engine, good MPG
- "dog" → Estate or SUV (more space)
- "commuting" → Petrol or Diesel, economical
- Years: if they say "less than 10 years old" calculate yearMin as current year - 10 (2016)

${conversationContext ? `\nConversation history:\n${conversationContext}\n` : ''}

User's latest message: "${message}"

Respond ONLY with valid JSON in this exact format:
{
  "criteria": { /* search parameters */ },
  "response": "Your friendly message here"
}`;

      const result = await model.generateContent(systemPrompt);
      const responseText = result.response.text();
      
      // Extract JSON from response (handle markdown code blocks)
      let jsonText = responseText.trim();
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/```\n?/g, '').trim();
      }

      const aiResponse = JSON.parse(jsonText);
      const criteria: SearchCriteria = aiResponse.criteria || {};
      
      // Search for matching cars
      const cars = await this.searchCars(criteria);
      
      return {
        message: aiResponse.response,
        cars: cars.slice(0, 5), // Return top 5 matches
        searchCriteria: criteria,
        totalMatches: cars.length,
      };
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback response
      return {
        message: "I'm having trouble understanding that. Could you try rephrasing? For example: 'I'm looking for a family car under €15,000'",
        cars: [],
        searchCriteria: {},
        totalMatches: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private static async searchCars(criteria: SearchCriteria) {
    const whereClause: any = {
      status: 'active',
    };

    // Price filter
    if (criteria.priceMax) {
      whereClause.price = { lte: criteria.priceMax };
    }

    // Year filter
    if (criteria.yearMin || criteria.yearMax) {
      whereClause.year = {};
      if (criteria.yearMin) whereClause.year.gte = criteria.yearMin;
      if (criteria.yearMax) whereClause.year.lte = criteria.yearMax;
    }

    // Text filters (case-insensitive contains)
    if (criteria.make) {
      whereClause.make = { contains: criteria.make, mode: 'insensitive' };
    }
    if (criteria.model) {
      whereClause.model = { contains: criteria.model, mode: 'insensitive' };
    }
    if (criteria.fuelType) {
      whereClause.fuelType = { contains: criteria.fuelType, mode: 'insensitive' };
    }
    if (criteria.transmission) {
      whereClause.transmission = { contains: criteria.transmission, mode: 'insensitive' };
    }
    if (criteria.location) {
      whereClause.location = { contains: criteria.location, mode: 'insensitive' };
    }

    console.log('🤖 Chat search criteria:', JSON.stringify(whereClause, null, 2));

    const cars = await prisma.car.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { createdAt: 'desc' },
      ],
      take: 20, // Limit results
    });

    return cars;
  }
}
