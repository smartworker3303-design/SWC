"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  expiresAt: string;
  onExpire?: () => void;
  className?: string;
}

export default function CountdownTimer({ expiresAt, onExpire, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const calculateTimeLeft = () => {
      const difference = new Date(expiresAt).getTime() - Date.now();
      
      if (difference <= 0) {
        return null;
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (!newTimeLeft) {
        clearInterval(timer);
        if (onExpire) onExpire();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt, onExpire]);

  // Don't render until hydration to prevent mismatch
  if (!isClient || !timeLeft) return null;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-mono font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-1 sm:px-3 sm:py-1.5 rounded-sm w-fit ${className}`}>
      <Clock className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
      <span className="uppercase tracking-wider text-[9px] sm:text-[10px]">Ends in:</span>
      <div className="flex items-center gap-1 text-[10px] sm:text-xs">
        <span className="bg-red-500/20 px-1 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
        <span className="bg-red-500/20 px-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
        <span className="bg-red-500/20 px-1 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
