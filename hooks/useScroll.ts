import React, { useEffect, useState, useCallback } from 'react';

export const useScroll = () => {
  const [y, setY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'Down' | 'Up' | null>(
    null
  );

  console.log()
  
  const handleNavigation = useCallback(
    (e) => {
      if (typeof window !== 'undefined') {
        if (y > window.scrollY) {
          setScrollDirection('Up');
        } else if (y < window.scrollY) {
          setScrollDirection('Down');
        }
        setY(window.scrollY);
      }
    },
    [y]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleNavigation);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleNavigation);
      }
    };
  }, [handleNavigation]);

  return { directon: scrollDirection, offset: y };
};
