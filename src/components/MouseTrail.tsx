"use client";

import { useEffect, useRef } from "react";

export default function MouseTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let points: { x: number; y: number; age: number }[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const onMouseMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY, age: 0 });
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        points.push({ x: e.touches[0].clientX, y: e.touches[0].clientY, age: 0 });
      }
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update age of points and remove old ones
      points.forEach(p => p.age++);
      points = points.filter(p => p.age < 30); // Trail length

      if (points.length > 0) {
        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            // Smooth curve
            const xc = (points[i - 1].x + p.x) / 2;
            const yc = (points[i - 1].y + p.y) / 2;
            ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
          }
        }

        // Draw last point
        ctx.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        // Styling for luxury gold glow
        ctx.strokeStyle = "rgba(212, 175, 55, 0.6)"; 
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.shadowBlur = 20;
        ctx.shadowColor = "rgba(212, 175, 55, 1)";
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[100]"
      aria-hidden="true"
    />
  );
}
