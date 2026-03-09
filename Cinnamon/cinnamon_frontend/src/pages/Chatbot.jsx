import { useState, useEffect, useRef } from 'react';
import './css/Chatbot.css';
import { askChatbot } from '../services/api';
import { FaRobot, FaUser, FaPaperPlane } from 'react-icons/fa';

export default function Chatbot() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const q = question.trim();
    setMessages(prev => [...prev, { role: 'user', text: q }]);
    setQuestion('');
    setLoading(true);

    try {
      const { answer } = await askChatbot(q);
      setMessages(prev => [...prev, { role: 'bot', text: answer }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: '❗ I am having trouble connecting. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-chat-container">
      <div className="ai-chat-card">
        <header className="ai-chat-header">
          <div className="bot-info">
            <div className="bot-avatar"><FaRobot /></div>
            <div>
              <h3>Cinnamon Guide AI</h3>
              <span className="online-tag">Online & Ready to help</span>
            </div>
          </div>
        </header>

        <div className="ai-chat-window">
          {messages.length === 0 && (
            <div className="ai-placeholder">
              <div className="placeholder-icon">🌿</div>
              <p>Welcome! Ask me anything about Cinnamon types, benefits, or usage tips.</p>
            </div>
          )}
          
          {messages.map((m, idx) => (
            <div key={idx} className={`ai-msg-row ${m.role}`}>
              <div className="ai-avatar-circle">
                {m.role === 'user' ? <FaUser /> : <FaRobot />}
              </div>
              <div className="ai-bubble">
                {m.text}
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="ai-msg-row bot">
              <div className="ai-avatar-circle"><FaRobot /></div>
              <div className="ai-bubble typing-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleAsk} className="ai-chat-form">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about spices, health benefits..."
          />
          <button type="submit" disabled={loading || !question.trim()}>
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}