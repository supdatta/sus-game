import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollToHash() {
  const { hash } = useLocation();
  
  useEffect(() => {
    if (hash) {
      // Remove the # symbol
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      
      if (element) {
        // Wait a bit for the DOM to fully render
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [hash]);
}