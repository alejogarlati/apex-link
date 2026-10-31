import React, { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export const LetterboxContainer: React.FC<Props> = ({ children }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1920;
      const targetHeight = 864; // Aspect ratio ~2.22:1
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const scaleX = windowWidth / targetWidth;
      const scaleY = windowHeight / targetHeight;
      const finalScale = Math.min(scaleX, scaleY);

      setScale(finalScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex items-center justify-center select-none touch-none">
      <div
        style={{
          width: '1920px',
          height: '864px',
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
        }}
        className="relative bg-black text-white shrink-0 shadow-2xl overflow-hidden border border-zinc-900"
      >
        {children}
      </div>
    </div>
  );
};
