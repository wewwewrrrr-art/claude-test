import React, { useEffect, useRef } from 'react';

const SIZE = 200;
const CENTER = SIZE / 2;
const GLOBE_RADIUS = 70;
const INK = '#1A1A1A';
const SPHERE_FILL = '#EFEAE0';
const BG = '#F5F1E8';

const GlobeLoader = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let raf = 0;
    let cancelled = false;

    (async () => {
      const [d3, topojson, world] = await Promise.all([
        import('https://esm.sh/d3-geo@3'),
        import('https://esm.sh/topojson-client@3'),
        fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((r) => r.json()),
      ]);
      if (cancelled || !canvasRef.current) return;

      const land = topojson.feature(world, world.objects.countries);
      const canvas = canvasRef.current;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = SIZE * dpr;
      canvas.height = SIZE * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const projection = d3
        .geoOrthographic()
        .scale(GLOBE_RADIUS)
        .translate([CENTER, CENTER])
        .clipAngle(90);
      const path = d3.geoPath(projection, ctx);
      const graticule = d3.geoGraticule10();
      const sphere = { type: 'Sphere' };

      let lambda = 0;

      const draw = () => {
        projection.rotate([lambda, -10]);
        ctx.clearRect(0, 0, SIZE, SIZE);

        ctx.beginPath();
        path(sphere);
        ctx.fillStyle = SPHERE_FILL;
        ctx.fill();
        ctx.strokeStyle = INK;
        ctx.lineWidth = 1.25;
        ctx.stroke();

        ctx.beginPath();
        path(graticule);
        ctx.strokeStyle = 'rgba(26,26,26,0.18)';
        ctx.lineWidth = 0.6;
        ctx.stroke();

        ctx.beginPath();
        path(land);
        ctx.strokeStyle = INK;
        ctx.lineWidth = 0.9;
        ctx.lineJoin = 'round';
        ctx.stroke();

        lambda = (lambda + 0.4) % 360;
        raf = requestAnimationFrame(draw);
      };
      draw();
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      style={{
        width: SIZE,
        height: SIZE,
        background: BG,
        borderRadius: 8,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: SIZE, height: SIZE, position: 'absolute', inset: 0 }}
      />
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={92}
          fill="none"
          stroke={INK}
          strokeWidth={1}
          strokeDasharray="6 8"
          strokeLinecap="round"
          style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            animation: 'globe-whirl-cw 4s linear infinite',
          }}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={82}
          fill="none"
          stroke={INK}
          strokeWidth={0.75}
          strokeDasharray="3 5"
          strokeLinecap="round"
          style={{
            transformOrigin: `${CENTER}px ${CENTER}px`,
            animation: 'globe-whirl-ccw 6s linear infinite',
          }}
        />
      </svg>
      <style>{`
        @keyframes globe-whirl-cw  { to { transform: rotate(360deg); } }
        @keyframes globe-whirl-ccw { to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  );
};

export default GlobeLoader;
