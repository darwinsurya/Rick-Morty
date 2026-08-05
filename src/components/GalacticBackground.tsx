import React, { useState, useEffect, useRef } from 'react';
import { GalacticTheme } from '../types';
import { soundFX } from '../utils/audio';

interface GalacticBackgroundProps {
  scanlinesEnabled: boolean;
  scanlineIntensity?: number;
  theme?: GalacticTheme;
  onThemeChange?: (theme: GalacticTheme) => void;
}

export const GalacticBackground: React.FC<GalacticBackgroundProps> = ({
  scanlinesEnabled,
  scanlineIntensity = 30,
  theme = 'quantum_nebula',
  onThemeChange,
}) => {
  const [currentTheme, setCurrentTheme] = useState<GalacticTheme>(theme);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showThemeControls, setShowThemeControls] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    setCurrentTheme(theme);
  }, [theme]);

  // Handle mouse move for interactive cosmic parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const px = (e.clientX / window.innerWidth - 0.5) * 30;
      const py = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x: px, y: py });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Canvas particle star field effect that responds to cursor
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate cosmic particles
    const particleCount = 80;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.8 + 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color:
        currentTheme === 'cyber_magenta'
          ? '#ff77e9'
          : currentTheme === 'deep_space'
          ? '#8dcdff'
          : currentTheme === 'citadel_matrix'
          ? '#00ffff'
          : currentTheme === 'cronenberg_crimson'
          ? '#ff5533'
          : '#aff81a',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx + mousePos.x * 0.01;
        p.y += p.vy + mousePos.y * 0.01;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [currentTheme, mousePos]);

  const selectTheme = (t: GalacticTheme) => {
    soundFX.playClick();
    soundFX.speak(`Galactic atmosphere switched to ${t.replace('_', ' ')}.`);
    setCurrentTheme(t);
    if (onThemeChange) onThemeChange(t);
  };

  // Background style profiles based on current theme
  const getThemeBgStyle = () => {
    switch (currentTheme) {
      case 'deep_space':
        return {
          background: 'radial-gradient(circle at 50% 50%, #0c1a30 0%, #050b18 60%, #01040a 100%)',
          nebulaGrad: 'radial-gradient(circle at 40% 40%, rgba(0, 175, 254, 0.25) 0%, transparent 60%)',
        };
      case 'cyber_magenta':
        return {
          background: 'radial-gradient(circle at 50% 50%, #300c2a 0%, #170415 60%, #080108 100%)',
          nebulaGrad: 'radial-gradient(circle at 60% 30%, rgba(255, 119, 233, 0.25) 0%, transparent 60%)',
        };
      case 'citadel_matrix':
        return {
          background: 'radial-gradient(circle at 50% 50%, #092026 0%, #030d10 60%, #000508 100%)',
          nebulaGrad: 'radial-gradient(circle at 30% 70%, rgba(0, 255, 204, 0.2) 0%, transparent 60%)',
        };
      case 'cronenberg_crimson':
        return {
          background: 'radial-gradient(circle at 50% 50%, #3a0d0c 0%, #1c0504 60%, #080101 100%)',
          nebulaGrad: 'radial-gradient(circle at 50% 40%, rgba(255, 85, 51, 0.25) 0%, transparent 60%)',
        };
      case 'quantum_nebula':
      default:
        return {
          background: 'radial-gradient(circle at 50% 50%, #26193a 0%, #140727 70%, #000000 100%)',
          nebulaGrad: 'radial-gradient(circle at 30% 30%, rgba(141, 205, 255, 0.15) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(175, 248, 26, 0.12) 0%, transparent 50%)',
        };
    }
  };

  const themeStyle = getThemeBgStyle();

  return (
    <>
      {/* Galactic Atmosphere Base Canvas */}
      <div
        className="fixed inset-0 z-[-1] overflow-hidden transition-all duration-1000 pointer-events-none"
        style={{ background: themeStyle.background }}
      >
        {/* Parallax Nebula Cloud */}
        <div
          className="absolute inset-[-20%] transition-transform duration-300 ease-out pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x * 1.2}px, ${mousePos.y * 1.2}px, 0)`,
            background: themeStyle.nebulaGrad,
            filter: 'blur(50px)',
          }}
        />

        {/* Dynamic Starfield Image Layer */}
        <div
          className="absolute inset-[-30%] starfield opacity-40 pointer-events-none"
          style={{
            transform: `translate3d(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px, 0)`,
          }}
        />

        {/* Interactive Star & Energy Particle Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      </div>

      {/* CRT Scanline Overlay with Adjustable Opacity */}
      {scanlinesEnabled && (
        <div
          className="scanlines"
          style={{ opacity: (scanlineIntensity / 100) * 0.5 }}
        />
      )}
    </>
  );
};

