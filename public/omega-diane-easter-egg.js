(function () {
  'use strict';

  // Prevent multiple initializations
  if (window.__OMEGA_DIANE_EASTER_EGG_LOADED__) return;
  window.__OMEGA_DIANE_EASTER_EGG_LOADED__ = true;

  const TRIGGER_SEQUENCE = ['d', 'i', 'a', 'n', 'e'];
  let inputBuffer = [];
  let isOverlayActive = false;
  let activeOverlay = null;

  // Keypress Listener
  window.addEventListener('keydown', function (e) {
    // Ignore typing inside input, textarea, or contenteditable elements
    const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : '';
    if (tag === 'input' || tag === 'textarea' || (e.target && e.target.isContentEditable)) {
      return;
    }

    const key = e.key ? e.key.toLowerCase() : '';
    if (!key || key.length !== 1) return;

    inputBuffer.push(key);
    if (inputBuffer.length > TRIGGER_SEQUENCE.length) {
      inputBuffer.shift();
    }

    if (inputBuffer.join('') === TRIGGER_SEQUENCE.join('')) {
      inputBuffer = [];
      triggerOmegaOverlay();
    }
  });

  // Self-contained Web Audio API synthesizer sound for retro glitch/telemetry
  function playOmegaAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Deep drone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 3.5);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 4.0);

      // Glitch bleeps
      for (let i = 0; i < 6; i++) {
        const bleepOsc = ctx.createOscillator();
        const bleepGain = ctx.createGain();
        const startTime = ctx.currentTime + i * 0.4 + Math.random() * 0.2;
        bleepOsc.type = 'sine';
        bleepOsc.frequency.setValueAtTime(400 + Math.random() * 800, startTime);

        bleepGain.gain.setValueAtTime(0.15, startTime);
        bleepGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);

        bleepOsc.connect(bleepGain);
        bleepGain.connect(ctx.destination);
        bleepOsc.start(startTime);
        bleepOsc.stop(startTime + 0.15);
      }
    } catch (err) {
      // Ignore audio context autoplay policy restrictions gracefully
    }
  }

  function triggerOmegaOverlay() {
    if (isOverlayActive) return;
    isOverlayActive = true;

    playOmegaAudio();

    // Inject self-contained styles
    const styleId = 'omega-diane-styles';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        .omega-overlay-root {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          background-color: rgba(5, 2, 10, 0.92) !important;
          z-index: 9999999 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          font-family: 'Courier New', Courier, monospace !important;
          box-sizing: border-box !important;
          overflow: hidden !important;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
        }

        .omega-overlay-root.omega-active {
          opacity: 1;
        }

        /* CRT Scanline Effect */
        .omega-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%,
            rgba(0, 0, 0, 0.5) 50%
          ), linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.03),
            rgba(0, 255, 0, 0.01),
            rgba(0, 0, 255, 0.03)
          );
          background-size: 100% 4px, 6px 100%;
          z-index: 10;
        }

        /* Terminal Window */
        .omega-terminal-box {
          position: relative;
          z-index: 20;
          width: 90%;
          max-width: 650px;
          background: #0d041a;
          border: 1px solid #aff81a;
          box-shadow: 0 0 30px rgba(175, 248, 26, 0.3), inset 0 0 15px rgba(175, 248, 26, 0.1);
          border-radius: 8px;
          padding: 24px;
          color: #aff81a;
          box-sizing: border-box;
          margin-bottom: 20px;
        }

        .omega-terminal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(175, 248, 26, 0.3);
          padding-bottom: 10px;
          margin-bottom: 16px;
          font-size: 12px;
          letter-spacing: 1px;
        }

        .omega-close-btn {
          background: transparent;
          border: 1px solid #aff81a;
          color: #aff81a;
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          font-family: inherit;
          font-size: 12px;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .omega-close-btn:hover {
          background: #aff81a;
          color: #0d041a;
          box-shadow: 0 0 10px #aff81a;
        }

        .omega-terminal-body {
          font-size: 14px;
          line-height: 1.6;
          color: #00ffcc;
          text-shadow: 0 0 8px rgba(0, 255, 204, 0.6);
        }

        .omega-glitch-text {
          animation: omegaGlitch 2s infinite alternate;
          color: #ff3366;
          font-weight: bold;
          text-shadow: 0 0 10px #ff3366;
        }

        @keyframes omegaGlitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .omega-canvas-container {
          position: relative;
          z-index: 20;
          width: 300px;
          height: 320px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .omega-canvas {
          width: 300px;
          height: 320px;
        }

        .omega-esc-hint {
          position: absolute;
          bottom: 20px;
          z-index: 20;
          color: rgba(175, 248, 26, 0.7);
          font-size: 11px;
          letter-spacing: 1.5px;
        }
      `;
      document.head.appendChild(styleEl);
    }

    // Root Overlay
    const overlay = document.createElement('div');
    overlay.className = 'omega-overlay-root';
    activeOverlay = overlay;

    // Scanlines
    const scanlines = document.createElement('div');
    scanlines.className = 'omega-scanlines';
    overlay.appendChild(scanlines);

    // Terminal Box
    const terminalBox = document.createElement('div');
    terminalBox.className = 'omega-terminal-box';

    const terminalHeader = document.createElement('div');
    terminalHeader.className = 'omega-terminal-header';
    terminalHeader.innerHTML = '<span>CLASSIFIED OMEGA DEVICE - SUB-SPACE SPECTRUM</span>';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'omega-close-btn';
    closeBtn.innerText = 'ESC [CLOSE]';
    closeBtn.onclick = removeOmegaOverlay;
    terminalHeader.appendChild(closeBtn);

    const terminalBody = document.createElement('div');
    terminalBody.className = 'omega-terminal-body';

    // Typewriter / Glitch Terminal Content
    terminalBody.innerHTML = `
      <div style="margin-bottom:8px; color:#aff81a;">> INITIATING OMEGA DIMENSIONAL SWEEP...</div>
      <div style="margin-bottom:8px; color:#8dcdff;">> FREQUENCY MATCH: C-137 ANOMALOUS MEMORY CORE</div>
      <div class="omega-glitch-text" style="font-size:15px; margin-top:12px; margin-bottom:8px;">
        [OMEGA DEVICE LOG]: Target 'Diane Sanchez' not found in present reality.
      </div>
      <div style="font-size:11px; color:#8c947a;">STATUS: TEMPORAL MATRIX DISSOLUTION IN PROGRESS...</div>
    `;

    terminalBox.appendChild(terminalHeader);
    terminalBox.appendChild(terminalBody);
    overlay.appendChild(terminalBox);

    // Holographic Silhouette Canvas
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'omega-canvas-container';

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 320;
    canvas.className = 'omega-canvas';
    canvasContainer.appendChild(canvas);
    overlay.appendChild(canvasContainer);

    // ESC Hint
    const escHint = document.createElement('div');
    escHint.className = 'omega-esc-hint';
    escHint.innerText = 'PRESS [ESC] OR CLICK CLOSE TO RESTORE REALITY';
    overlay.appendChild(escHint);

    document.body.appendChild(overlay);

    // Trigger Fade-In
    requestAnimationFrame(() => {
      overlay.classList.add('omega-active');
    });

    // Particle Dissolving Animation on Canvas over 4 Seconds
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Generate Silhouette Particles
    const particles = [];
    const numParticles = 800;

    for (let i = 0; i < numParticles; i++) {
      // Form silhouette shape (head + shoulders silhouette)
      let px, py;
      if (Math.random() < 0.35) {
        // Head circle
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * 45;
        px = 150 + Math.cos(angle) * r;
        py = 90 + Math.sin(angle) * r;
      } else {
        // Shoulders / dress curve
        const angle = Math.random() * Math.PI;
        const r = Math.random() * 95;
        px = 150 + Math.cos(angle) * r;
        py = 180 + Math.sin(angle) * (r * 1.2);
      }

      particles.push({
        x: px,
        y: py,
        origX: px,
        origY: py,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2.5 - 0.5,
        size: Math.random() * 3 + 1.5,
        alpha: Math.random() * 0.8 + 0.2,
        decay: Math.random() * 0.005 + 0.002,
        color: Math.random() < 0.7 ? '#aff81a' : '#00ffcc',
      });
    }

    let startTime = null;
    let animFrameId = null;

    function renderParticles(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / 4000; // 4 seconds total duration

      ctx.clearRect(0, 0, width, height);

      // Draw soft glowing silhouette background aura during first 2 seconds
      if (progress < 0.6) {
        const glowAlpha = Math.max(0, (0.6 - progress) / 0.6);
        const grad = ctx.createRadialGradient(150, 140, 10, 150, 140, 120);
        grad.addColorStop(0, `rgba(175, 248, 26, ${0.4 * glowAlpha})`);
        grad.addColorStop(0.6, `rgba(0, 255, 204, ${0.15 * glowAlpha})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(150, 140, 120, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Start disintegrating & floating upwards as time progresses
        if (progress > 0.1) {
          p.x += p.vx * (1 + progress * 2);
          p.y += p.vy * (1 + progress * 2);
          p.alpha -= p.decay * (1 + progress * 2);
        }

        if (p.alpha > 0) {
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.fillRect(p.x, p.y, p.size, p.size);
        }
      }

      ctx.globalAlpha = 1.0;

      if (progress < 1.0 && isOverlayActive) {
        animFrameId = requestAnimationFrame(renderParticles);
      }
    }

    animFrameId = requestAnimationFrame(renderParticles);

    // Escape Key Listener
    function onKeyDown(e) {
      if (e.key === 'Escape' || e.key === 'Esc') {
        removeOmegaOverlay();
      }
    }
    window.addEventListener('keydown', onKeyDown);

    function removeOmegaOverlay() {
      if (!isOverlayActive) return;
      isOverlayActive = false;
      window.removeEventListener('keydown', onKeyDown);

      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }

      if (overlay) {
        overlay.classList.remove('omega-active');
        setTimeout(() => {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 400);
      }
      activeOverlay = null;
    }
  }

  // Export trigger globally so users or app can invoke manually if desired
  window.triggerOmegaDeviceEasterEgg = triggerOmegaOverlay;
})();
