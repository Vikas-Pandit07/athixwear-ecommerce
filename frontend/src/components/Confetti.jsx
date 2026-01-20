import React, { useEffect } from 'react';

const Confetti = () => {
  useEffect(() => {
    const confettiCount = 50;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);

    const colors = ['#D4AF37', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = Math.random() * 10 + 5 + 'px';
      confetti.style.height = Math.random() * 10 + 5 + 'px';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
      container.appendChild(confetti);
    }

    setTimeout(() => {
      document.body.removeChild(container);
    }, 5000);

    return () => {
      if (container.parentNode) {
        document.body.removeChild(container);
      }
    };
  }, []);

  return null;
};

export default Confetti;
