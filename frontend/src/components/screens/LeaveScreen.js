import React, { useState, useEffect, useRef } from 'react';

const LeaveScreen = ({ setIsMeetingLeft }) => {
  const [countdown, setCountdown] = useState(10);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setIsMeetingLeft(false);
    }, countdown * 1000);

    return () => clearTimeout(timerRef.current);
  }, [countdown, setIsMeetingLeft]);

  const handleClick = () => {
    setIsMeetingLeft(false);
    clearTimeout(timerRef.current);
  };

  useEffect(() => {
    if (countdown > 0) {
      const countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [countdown]);

  return (
    <div className="bg-gray-800 h-screen flex flex-col flex-1 items-center justify-center">
      <h1 className="text-white text-4xl">You left the meeting!</h1>
      <div className="mt-6">
        <button
          className="w-full bg-gray-700 text-white px-16 py-3 rounded-lg text-sm mt-2 mb-2"
          onClick={handleClick}
        >
          Go to Home ({countdown})
        </button>
      </div>
    </div>
  );
}
export default LeaveScreen;
