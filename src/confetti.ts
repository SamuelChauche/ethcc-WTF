interface Particle {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  r: number;
  dr: number;
  dy: number;
  dx: number;
  alpha: number;
}

const COLORS = ['#7c3aed', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#fff'];

export function launchConfetti(duration = 2200): void {
  const canvas = document.getElementById('confetti-canvas') as HTMLCanvasElement;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Particle[] = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 5 + Math.random() * 7,
    h: 3 + Math.random() * 5,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    r: Math.random() * Math.PI * 2,
    dr: (Math.random() - 0.5) * 0.12,
    dy: 2.5 + Math.random() * 3.5,
    dx: (Math.random() - 0.5) * 1.8,
    alpha: 1,
  }));

  const start = performance.now();

  function frame(now: number): void {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = now - start;
    const fade = Math.max(0, 1 - (elapsed - (duration - 600)) / 600);

    particles.forEach((p) => {
      p.y += p.dy;
      p.x += p.dx;
      p.r += p.dr;
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.r);
      ctx!.globalAlpha = p.alpha * fade;
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx!.restore();
    });

    if (elapsed < duration) requestAnimationFrame(frame);
    else ctx!.clearRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(frame);
}
