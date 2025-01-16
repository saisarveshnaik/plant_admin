import React, { useState, useEffect } from 'react';

interface CountUpProps {
  endNumber: number;
  duration: number; // Duration for the count-up animation (in milliseconds)
}

const CountUp: React.FC<CountUpProps> = ({ endNumber, duration }) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const animateCountUp = () => {
      const timeElapsed = Date.now() - startTime;
      const progress = Math.min(timeElapsed / duration, 1); // Normalize progress

      setCurrentNumber(Math.floor(progress * endNumber));

      if (progress < 1) {
        requestAnimationFrame(animateCountUp); // Keep animating until complete
      }
    };

    requestAnimationFrame(animateCountUp);
  }, [endNumber, duration]);

  return <span>{currentNumber}</span>;
};

export default CountUp;
