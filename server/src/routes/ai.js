import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI lazily - check on each request
function getOpenAIClient() {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return null;
}

router.post('/chat', async (req, res) => {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return res.status(503).json({ 
        error: 'OpenAI API key not configured. Please add your API key to the .env file.',
        response: 'AI Assistant is not configured. Please add your OpenAI API key to server/.env file to enable this feature.'
      });
    }

    const { message, context, history } = req.body;
    
    const systemPrompt = `You are an expert UDCPR 2020 (Unified Development Control and Promotion Regulations) consultant for Maharashtra, India.

Your expertise includes:
- FSI (Floor Space Index) calculations for all zones (Residential, Commercial, Industrial, Mixed-use)
- Setback requirements (front, side, rear) based on plot size and road width
- Building height restrictions and regulations
- Parking requirements (ECS - Equivalent Car Space)
- TDR (Transferable Development Rights) regulations
- Heritage zone restrictions (Grade I & II)
- CRZ (Coastal Regulation Zone) regulations
- TOD (Transit Oriented Development) zones
- Green building requirements
- Fire safety and structural requirements
- Universal accessibility guidelines
- Affordable housing regulations

You have access to:
- Mumbai-specific UDCPR (459 rules from 261 pages)
- Rest of Maharashtra UDCPR (628 rules from 491 pages)
- All 30 districts across 6 regions (Konkan, Pune, Nashik, Aurangabad, Nagpur, Amravati)

Guidelines:
1. Provide specific clause numbers when referencing UDCPR rules
2. Explain calculations step-by-step
3. Mention district-specific variations when relevant
4. Always include legal disclaimer for final verification
5. Be practical and actionable in your advice
6. Ask clarifying questions if needed (district, zone type, plot size, etc.)

Context: ${context || 'General UDCPR query'}`;
    
    // Build message history
    const messages = [
      { role: "system", content: systemPrompt }
    ];
    
    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      messages.push(...history);
    }
    
    // Add current message
    messages.push({ role: "user", content: message });
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency
      messages: messages,
      temperature: 0.7,
      max_tokens: 1500,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });
    
    res.json({ 
      response: completion.choices[0].message.content,
      usage: completion.usage,
      model: "gpt-4o-mini"
    });
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ 
      error: error.message,
      response: 'Sorry, I encountered an error. Please try again.'
    });
  }
});

// Quick answers endpoint for common questions
router.post('/quick-answer', async (req, res) => {
  try {
    const openai = getOpenAIClient();
    if (!openai) {
      return res.status(503).json({ error: 'OpenAI not configured' });
    }

    const { question, district, zone } = req.body;
    
    const prompt = `Quick answer for UDCPR query:
District: ${district || 'General'}
Zone: ${zone || 'Not specified'}
Question: ${question}

Provide a concise answer (2-3 sentences) with relevant clause numbers.`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a UDCPR expert. Provide concise, accurate answers." },
        { role: "user", content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 200
    });
    
    res.json({ 
      answer: completion.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
