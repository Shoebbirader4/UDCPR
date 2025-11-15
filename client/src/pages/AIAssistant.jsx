import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Sparkles, BookOpen, Calculator, MapPin, Trash2 } from 'lucide-react';

function AIAssistant() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [district, setDistrict] = useState('');
  const [zone, setZone] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    "What is the permissible FSI for residential zones in Mumbai?",
    "What are the setback requirements for a 500 sq.m plot?",
    "Explain parking requirements for commercial buildings",
    "What is TDR and how does it work?",
    "What are the height restrictions for residential buildings?"
  ];

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = `District: ${district || 'Not specified'}, Zone: ${zone || 'Not specified'}`;
      const history = messages.slice(-6); // Last 3 exchanges for context
      
      const response = await axios.post('/api/ai/chat', { 
        message: input,
        context,
        history
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: response.data.response,
        model: response.data.model
      }]);
    } catch (error) {
      const errorMsg = error.response?.data?.response || error.message;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `❌ Error: ${errorMsg}`,
        isError: true
      }]);
    }
    setLoading(false);
  };

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  const clearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '40px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={32} color="#8b5cf6" />
          UDCPR AI Assistant
        </h1>
        <p style={{ color: '#666' }}>
          Ask questions about UDCPR 2020 regulations. Powered by GPT-4o-mini with 1,087 rules from official PDFs.
        </p>
      </div>

      {/* Context Selection */}
      <div className="card" style={{ marginBottom: '20px', background: '#f9fafb' }}>
        <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#666' }}>Optional Context (helps with specific answers)</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>District</label>
            <select 
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              style={{ fontSize: '14px' }}
            >
              <option value="">Any District</option>
              <option value="Mumbai City">Mumbai City</option>
              <option value="Mumbai Suburban">Mumbai Suburban</option>
              <option value="Pune">Pune</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Nashik">Nashik</option>
              <option value="Aurangabad">Aurangabad</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '5px' }}>Zone Type</label>
            <select 
              value={zone}
              onChange={(e) => setZone(e.target.value)}
              style={{ fontSize: '14px' }}
            >
              <option value="">Any Zone</option>
              <option value="Residential">Residential (R1, R2, R3)</option>
              <option value="Commercial">Commercial (C1, C2, C3)</option>
              <option value="Industrial">Industrial (I1, I2)</option>
              <option value="Mixed">Mixed Use</option>
              <option value="TOD">TOD (Transit Oriented)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      {messages.length === 0 && (
        <div className="card" style={{ marginBottom: '20px', background: '#fef3c7', border: '2px solid #f59e0b' }}>
          <h4 style={{ marginBottom: '10px', color: '#92400e', fontSize: '14px' }}>💡 Try asking:</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleQuickQuestion(q)}
                style={{
                  background: 'white',
                  border: '1px solid #f59e0b',
                  padding: '10px',
                  borderRadius: '6px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '13px',
                  color: '#92400e',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fffbeb'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="card" style={{ minHeight: '400px', maxHeight: '500px', overflowY: 'auto', position: 'relative' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
            <Sparkles size={48} color="#8b5cf6" style={{ marginBottom: '20px' }} />
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>Ask me anything about UDCPR 2020</p>
            <p style={{ fontSize: '14px' }}>I can help with FSI, setbacks, parking, zoning, and more!</p>
          </div>
        )}
        
        {messages.map((msg, i) => (
          <div 
            key={i} 
            style={{ 
              marginBottom: '15px',
              padding: '14px',
              background: msg.role === 'user' ? '#e0e7ff' : msg.isError ? '#fee2e2' : '#f3f4f6',
              borderRadius: '12px',
              marginLeft: msg.role === 'user' ? '60px' : '0',
              marginRight: msg.role === 'assistant' ? '60px' : '0',
              borderLeft: msg.role === 'assistant' ? '4px solid #8b5cf6' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              {msg.role === 'user' ? (
                <span style={{ fontSize: '20px' }}>👤</span>
              ) : (
                <Sparkles size={20} color="#8b5cf6" />
              )}
              <strong style={{ fontSize: '14px' }}>
                {msg.role === 'user' ? 'You' : 'AI Assistant'}
              </strong>
              {msg.model && (
                <span style={{ fontSize: '11px', color: '#999', marginLeft: 'auto' }}>
                  {msg.model}
                </span>
              )}
            </div>
            <p style={{ marginTop: '5px', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px' }}>
              {msg.content}
            </p>
          </div>
        ))}
        
        {loading && (
          <div style={{ padding: '14px', background: '#f3f4f6', borderRadius: '12px', marginRight: '60px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="#8b5cf6" />
              <span style={{ fontSize: '14px', color: '#666' }}>AI is analyzing UDCPR regulations...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ marginTop: '15px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Ask about FSI, setbacks, parking, zoning, TDR, heritage zones..."
            style={{ flex: 1, fontSize: '14px' }}
            disabled={loading}
          />
          {messages.length > 0 && (
            <button 
              onClick={clearChat}
              style={{ 
                background: '#ef4444', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '5px',
                padding: '10px 16px'
              }}
            >
              <Trash2 size={18} />
            </button>
          )}
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{ 
              background: loading ? '#9ca3af' : '#8b5cf6', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '5px',
              padding: '10px 20px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            <Send size={18} /> Send
          </button>
        </div>
        <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
          💡 Tip: Specify district and zone for more accurate answers. AI responses are for reference only - verify with official UDCPR documents.
        </p>
      </div>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '30px' }}>
        <div className="card" style={{ background: '#e0f2fe', border: '2px solid #0284c7', textAlign: 'center' }}>
          <BookOpen size={24} color="#0284c7" style={{ marginBottom: '8px' }} />
          <h4 style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '5px' }}>1,087 Rules</h4>
          <p style={{ fontSize: '12px', color: '#0c4a6e' }}>From official PDFs</p>
        </div>
        <div className="card" style={{ background: '#fef3c7', border: '2px solid #f59e0b', textAlign: 'center' }}>
          <MapPin size={24} color="#f59e0b" style={{ marginBottom: '8px' }} />
          <h4 style={{ fontSize: '14px', color: '#92400e', marginBottom: '5px' }}>30 Districts</h4>
          <p style={{ fontSize: '12px', color: '#92400e' }}>All Maharashtra</p>
        </div>
        <div className="card" style={{ background: '#f0fdf4', border: '2px solid #10b981', textAlign: 'center' }}>
          <Calculator size={24} color="#10b981" style={{ marginBottom: '8px' }} />
          <h4 style={{ fontSize: '14px', color: '#065f46', marginBottom: '5px' }}>AI Powered</h4>
          <p style={{ fontSize: '12px', color: '#065f46' }}>GPT-4o-mini</p>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
