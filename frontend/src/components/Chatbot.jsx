import React, { useState, useEffect, useRef } from 'react';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Ayubowan! 🙏 I am your Ceylon Wonders AI guide. How can I help you plan your perfect luxury stay in Sri Lanka today?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMsg = input;
    setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
    setInput('');

    // Simulate AI typing delay
    setTimeout(() => {
      let botResponse = 'That sounds wonderful! Sri Lanka has perfectly categorized destinations for that. You should check out our Explore page to see UNESCO World Heritage sites and highland tea-trails.';
      
      if (userMsg.toLowerCase().includes('beach')) {
        botResponse = 'For beaches, Galle and Mirissa in the Southern Province are absolute paradise! I highly recommend checking out "Heritage Escape" in Galle on our Booking page.';
      } else if (userMsg.toLowerCase().includes('kandy')) {
        botResponse = 'Kandy is the cultural heart of Sri Lanka! Make sure you visit the Sri Dalada Maligawa (Temple of the Tooth). Let me know if you want me to search for Kandy hotels for you.';
      } else if (userMsg.toLowerCase().includes('price') || userMsg.toLowerCase().includes('cost')) {
        botResponse = 'Our luxury packages offer the best price guarantee, averaging around $300-$800 per night. You can proceed to the Book Hotels page for live pricing updates!';
      }

      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999,
          width: '60px', height: '60px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #C9A84C, #F39C12)',
          border: '2px solid rgba(255,255,255,0.2)',
          boxShadow: '0 10px 30px rgba(201,168,76,0.5)',
          color: '#050D10', fontSize: '1.5rem', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1) translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1) translateY(0)'}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'}`}></i>
      </button>

      {/* Chat Window */}
      <div style={{
        position: 'fixed', bottom: '6rem', right: '2.5rem', zIndex: 9998,
        width: '350px', height: '500px',
        background: 'rgba(11, 61, 69, 0.95)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(201,168,76,0.4)', borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(5,13,16,0.9)',
        overflow: 'hidden', display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
      }}>
        {/* Header */}
        <div style={{ padding: '1.25rem', background: '#050D10', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #F39C12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050D10', fontSize: '1.2rem' }}>
            <i className="fas fa-magic"></i>
          </div>
          <div>
            <h4 style={{ margin: 0, fontFamily: "'Cinzel', serif", color: '#C9A84C', fontSize: '1.1rem' }}>Wonders AI</h4>
            <div style={{ fontSize: '0.7rem', color: '#1ABC9C', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '6px', height: '6px', background: '#1ABC9C', borderRadius: '50%' }}></div> Online
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m, i) => (
            <div key={i} style={{ 
              alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start',
              background: m.type === 'user' ? '#C9A84C' : 'rgba(255,255,255,0.05)',
              color: m.type === 'user' ? '#050D10' : '#fff',
              border: m.type === 'bot' ? '1px solid rgba(201,168,76,0.2)' : 'none',
              padding: '0.8rem 1rem', borderRadius: m.type === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
              maxWidth: '85%', fontSize: '0.9rem', lineHeight: 1.5,
              position: 'relative'
            }}>
              {m.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '1rem', background: '#050D10', display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..." 
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '50px', padding: '0.8rem 1.25rem', color: '#fff', outline: 'none' }} 
          />
          <button 
            onClick={handleSend}
            style={{ width: '45px', height: '45px', borderRadius: '50%', border: 'none', background: 'transparent', color: '#C9A84C', fontSize: '1.2rem', cursor: 'pointer', transition: 'color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#F39C12'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#C9A84C'}
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  );
}

export default Chatbot;
