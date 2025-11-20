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
    
    // Import Rule model dynamically to search database
    const Rule = (await import('../models/Rule.js')).default;
    
    // Search for relevant rules based on the query
    let relevantRules = [];
    let relevantTables = [];
    
    try {
      // Extract keywords from the message for better search
      const keywords = message.toLowerCase().match(/\b(fsi|setback|parking|height|tdr|heritage|crz|tod|margin|floor|space|index|residential|commercial|industrial|mixed|zone|building|plot|area|width|road|table)\b/g);
      
      if (keywords && keywords.length > 0) {
        // Search rules using text search or category matching
        const searchQuery = {
          $or: [
            { summary: { $regex: keywords.join('|'), $options: 'i' } },
            { category: { $regex: keywords.join('|'), $options: 'i' } },
            { clause: { $regex: keywords.join('|'), $options: 'i' } }
          ]
        };
        
        relevantRules = await Rule.find(searchQuery)
          .select('reference clause summary category chapter regulation')
          .limit(10)
          .lean();
      }
      
      // Check if user is asking about a specific table (e.g., "Table 3A", "table 3a", "3A")
      const tableMatch = message.match(/table\s*(?:no\.?\s*)?(\d+[A-Z]?)/i);
      console.log('🔍 Checking for table mention in message:', message);
      console.log('🔍 Table match result:', tableMatch);
      
      if (tableMatch) {
        try {
          const fs = (await import('fs')).default;
          const path = (await import('path')).default;
          const { fileURLToPath } = await import('url');
          const __filename = fileURLToPath(import.meta.url);
          const __dirname = path.dirname(__filename);
          
          const tablesPath = path.join(__dirname, '../data/extracted/all_tables_complete.json');
          console.log('📂 Looking for tables at:', tablesPath);
          console.log('📂 File exists?', fs.existsSync(tablesPath));
          
          if (fs.existsSync(tablesPath)) {
            const tablesData = JSON.parse(fs.readFileSync(tablesPath, 'utf8'));
            const allTables = [...(tablesData.udcpr || []), ...(tablesData.mumbai || [])];
            console.log(`📊 Total tables loaded: ${allTables.length}`);
            
            const tableNumber = tableMatch[1].toUpperCase();
            console.log(`🔍 Looking for table number: "${tableNumber}"`);
            
            // Log first few table numbers for debugging
            console.log('📋 Available table numbers:', allTables.slice(0, 10).map(t => t.number).join(', '));
            
            // Try exact match first
            let foundTable = allTables.find(t => t.number.toUpperCase() === tableNumber);
            
            // If not found, try partial match (e.g., "3A" might match "3A" or "3-A")
            if (!foundTable) {
              foundTable = allTables.find(t => 
                t.number.toUpperCase().replace(/[-\s]/g, '') === tableNumber.replace(/[-\s]/g, '')
              );
            }
            
            if (foundTable) {
              relevantTables.push(foundTable);
              console.log(`✅ Found table: ${foundTable.number} - ${foundTable.title}`);
            } else {
              console.log(`❌ Table ${tableNumber} not found in database`);
              console.log(`❌ Searched among: ${allTables.map(t => t.number).join(', ')}`);
            }
          } else {
            console.log('❌ Tables file does not exist at path');
          }
        } catch (tableError) {
          console.error('Table search error:', tableError.message);
        }
      }
    } catch (dbError) {
      console.log('Database search skipped:', dbError.message);
    }
    
    // Build enhanced system prompt with real rule data
    let ruleContext = '';
    if (relevantRules.length > 0) {
      ruleContext = '\n\nRELEVANT UDCPR RULES FROM DATABASE:\n';
      relevantRules.forEach((rule, idx) => {
        ruleContext += `\n${idx + 1}. [${rule.reference}] ${rule.clause}\n   Category: ${rule.category}\n   Summary: ${rule.summary}\n`;
      });
      ruleContext += '\n(Use these specific rules to provide accurate answers with exact clause references)';
    }
    
    // Add table data if found
    if (relevantTables.length > 0) {
      ruleContext += '\n\n⚠️ IMPORTANT - RELEVANT TABLES FROM DATABASE:\n';
      relevantTables.forEach((table, idx) => {
        ruleContext += `\n${idx + 1}. TABLE ${table.number}: ${table.title}\n   Type: ${table.type}\n   Full Content:\n${table.content}\n`;
      });
      ruleContext += '\n⚠️ CRITICAL: The user asked about this specific table. You MUST use the EXACT content provided above. Do NOT use general knowledge about this table. Provide the SPECIFIC measurements, widths, and requirements from the table content shown above.';
    }
    
    const systemPrompt = `You are an expert UDCPR 2020 (Unified Development Control and Promotion Regulations) consultant for Maharashtra, India.

DATABASE STATUS: Connected to live database with 3,776 real UDCPR rules extracted from official documents.

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
- 3,776 total rules from UDCPR database
- 15 chapters covering all aspects of development control
- 1,148 regulations organized hierarchically
- 182 extracted tables (Table 3A, 6A, 6B, 6C, 7A, etc.)
- Mumbai-specific UDCPR (2,603 rules)
- Rest of Maharashtra UDCPR (1,173 rules)
- All 30 districts across 6 regions

${ruleContext}

Guidelines:
1. ALWAYS cite specific clause numbers from the rules provided above
2. Reference the exact rule reference (e.g., UDCPR-5.2.1) when available
3. Explain calculations step-by-step with table references
4. Mention district-specific variations when relevant
5. If relevant rules are provided above, use them as primary source
6. Always include legal disclaimer for final verification
7. Be practical and actionable in your advice
8. Ask clarifying questions if needed (district, zone type, plot size, etc.)

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
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });
    
    res.json({ 
      response: completion.choices[0].message.content,
      usage: completion.usage,
      model: "gpt-4o-mini",
      rulesFound: relevantRules.length,
      tablesFound: relevantTables.length,
      relevantRules: relevantRules.map(r => ({ reference: r.reference, clause: r.clause })),
      relevantTables: relevantTables.map(t => ({ number: t.number, title: t.title }))
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

// Search rules endpoint - find relevant rules for a query
router.post('/search-rules', async (req, res) => {
  try {
    const { query, category, chapter } = req.body;
    const Rule = (await import('../models/Rule.js')).default;
    
    let searchFilter = {};
    
    // Build search filter
    if (category) {
      searchFilter.category = { $regex: category, $options: 'i' };
    }
    if (chapter) {
      searchFilter.chapter = parseInt(chapter);
    }
    
    // Add text search if query provided
    if (query) {
      searchFilter.$or = [
        { summary: { $regex: query, $options: 'i' } },
        { clause: { $regex: query, $options: 'i' } },
        { reference: { $regex: query, $options: 'i' } }
      ];
    }
    
    const rules = await Rule.find(searchFilter)
      .select('reference clause summary category chapter regulation applicableZones')
      .limit(20)
      .lean();
    
    res.json({ 
      rules,
      count: rules.length,
      query: query || 'all'
    });
  } catch (error) {
    console.error('Rule search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get rule suggestions based on context
router.post('/suggest-rules', async (req, res) => {
  try {
    const { plotSize, roadWidth, zone, buildingType } = req.body;
    const Rule = (await import('../models/Rule.js')).default;
    
    // Determine relevant categories based on context
    const categories = [];
    if (plotSize || roadWidth) categories.push('FSI', 'Setback');
    if (buildingType) categories.push('Height', 'Parking');
    if (zone) categories.push('Zoning');
    
    const rules = await Rule.find({
      category: { $in: categories.length > 0 ? categories : ['FSI', 'Setback', 'Height', 'Parking'] }
    })
    .select('reference clause summary category')
    .limit(10)
    .lean();
    
    res.json({ 
      suggestions: rules,
      context: { plotSize, roadWidth, zone, buildingType }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint to check table loading
router.get('/test-tables', async (req, res) => {
  try {
    const fs = (await import('fs')).default;
    const path = (await import('path')).default;
    const { fileURLToPath } = await import('url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const tablesPath = path.join(__dirname, '../data/extracted/all_tables_complete.json');
    
    if (fs.existsSync(tablesPath)) {
      const tablesData = JSON.parse(fs.readFileSync(tablesPath, 'utf8'));
      const allTables = [...(tablesData.udcpr || []), ...(tablesData.mumbai || [])];
      
      // Find Table 3A specifically
      const table3A = allTables.find(t => t.number === '3A');
      
      res.json({
        success: true,
        totalTables: allTables.length,
        table3AFound: !!table3A,
        table3A: table3A,
        sampleTableNumbers: allTables.slice(0, 20).map(t => t.number)
      });
    } else {
      res.json({
        success: false,
        error: 'Tables file not found',
        path: tablesPath
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
