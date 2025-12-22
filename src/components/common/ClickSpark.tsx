import React, { useRef, useEffect, useCallback } from 'react';

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  children?: React.ReactNode;
  maxSparks?: number;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  life: number;
  ttl: number;
  size: number;
  speed: number;
}

const ClickSpark: React.FC<ClickSparkProps> = ({
  sparkColor = '#1E6BFF',
  sparkSize = 8,
  sparkRadius = 28,
  sparkCount = 10,
  duration = 500,
  easing = 'ease-out',
  maxSparks = 300,
  children
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparksRef = useRef<Spark[]>([]);
  const lastTimeRef = useRef<number | null>(null);

  // Resize canvas to full viewport (fixed) so effect covers entire app
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const easeFunc = useCallback(
    (t: number) => {
      switch (easing) {
        case 'linear':
          return t;
        case 'ease-in':
          return t * t;
        case 'ease-in-out':
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        default:
          return t * (2 - t); // ease-out approx
      }
    },
    [easing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;

    const draw = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = Math.min(32, timestamp - lastTimeRef.current);
      lastTimeRef.current = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'lighter';

        const dpr = window.devicePixelRatio || 1;

      // update sparks (line-style)
      const sparks = sparksRef.current;
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.ttl) {
          sparks.splice(i, 1);
          continue;
        }

        const t = s.life / s.ttl;
        const eased = easeFunc(t);

        // distance grows with eased progress; include a small random speed factor
        const distance = eased * (sparkRadius + s.speed * 8);
        const lineLength = Math.max(1, sparkSize * (1 - eased));

        const cos = Math.cos(s.angle);
        const sin = Math.sin(s.angle);

        const x1 = (s.x * dpr) + distance * cos;
        const y1 = (s.y * dpr) + distance * sin;
        const x2 = (s.x * dpr) + (distance + lineLength) * cos;
        const y2 = (s.y * dpr) + (distance + lineLength) * sin;

        const alpha = Math.max(0.05, 1 - eased);
        const lineW = Math.max(0.8, (2 * dpr) * (1 - eased) + 0.5);

        ctx.beginPath();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = lineW;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [sparkColor, easeFunc]);

  const spawnSparks = useCallback((clientX: number, clientY: number) => {
    const count = Math.max(3, Math.min(20, sparkCount));
    const nowTtl = duration;
    const sparks = sparksRef.current;

    for (let i = 0; i < count; i++) {
      if (sparks.length >= maxSparks) {
        // reuse oldest
        sparks.shift();
      }
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 1.2; // small randomness used in distance
      sparks.push({ x: clientX, y: clientY, angle, life: 0, ttl: nowTtl, size: sparkSize * (0.6 + Math.random() * 0.8), speed });
    }
  }, [sparkCount, sparkRadius, sparkSize, duration, maxSparks]);

  // Listen global pointerdown to capture clicks/taps anywhere
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      // only primary button
      if ('button' in e && e.button !== 0) return;
      spawnSparks(e.clientX, e.clientY);
    };

    document.addEventListener('pointerdown', handler, { passive: true });
    return () => document.removeEventListener('pointerdown', handler);
  }, [spawnSparks]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9999]"
        style={{ display: 'block', width: '100vw', height: '100vh' }}
      />
      {children}
    </div>
  );
};

export default ClickSpark;
