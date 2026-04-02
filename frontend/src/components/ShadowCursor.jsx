import React, { useEffect, useRef } from 'react';

export default function ShadowCursor() {
  const cursorDotRef = useRef(null);
  const cursorSpotRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      if (cursorDotRef.current && cursorSpotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
        cursorSpotRef.current.style.transform = `translate3d(${clientX - 160}px, ${clientY - 160}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {/* Custom Cursor — hidden on touch devices */}
      <div 
        ref={cursorSpotRef} 
        className="cursor-spotlight bg-[radial-gradient(circle,rgba(240,192,112,0.15)_0%,transparent_70%)] hidden md:block"
        style={{ position: 'fixed', top: 0, left: 0, width: '320px', height: '320px', borderRadius: '50%', pointerEvents: 'none', zIndex: 99998 }}
      ></div>
      <div 
        ref={cursorDotRef} 
        className="cursor-dot bg-found-candle hidden md:block"
        style={{ zIndex: 99999 }}
      ></div>
    </>
  );
}
