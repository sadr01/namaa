import React, { useEffect, useState } from 'react'

export default function TimerBox({ time, setEndTimeFlag }) {
  const [timeLeft, setTimeLeft] = useState(time);
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(1, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };
  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(prev => {
        if (prev > 0)
          return prev - 1
        else {
          setEndTimeFlag(true);
          return 0
        }

      });
    }, 1000);
  }, [timeLeft]);

  return (
    <>
      {formatTime(timeLeft)}
    </>
  )
}
