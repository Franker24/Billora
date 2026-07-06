// Motion design system token values (inspired by Stripe, Linear, Vercel)
export const DURATION = {
  instant: 0,
  fast: 0.15,
  normal: 0.24,
  slow: 0.38,
};

export const EASING = {
  out: [0.16, 1, 0.3, 1], // Custom quad/cubic ease-out (highly responsive)
  inOut: [0.65, 0, 0.35, 1],
  springDefault: { type: 'spring', stiffness: 180, damping: 18 },
  springSnappy: { type: 'spring', stiffness: 260, damping: 22 },
  springGentle: { type: 'spring', stiffness: 120, damping: 15 },
};

// Check if user has prefers-reduced-motion active
const checkReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Return a motion transition config based on reduced motion setting
export const getTransition = (type: 'fast' | 'normal' | 'slow' | 'spring' | 'snappy' = 'normal') => {
  if (checkReducedMotion()) {
    return { type: 'tween', duration: DURATION.fast, ease: 'linear' };
  }
  
  switch (type) {
    case 'fast':
      return { duration: DURATION.fast, ease: EASING.out };
    case 'slow':
      return { duration: DURATION.slow, ease: EASING.out };
    case 'spring':
      return EASING.springDefault;
    case 'snappy':
      return EASING.springSnappy;
    case 'normal':
    default:
      return { duration: DURATION.normal, ease: EASING.out };
  }
};

// Common reusable variants that adapt automatically to prefers-reduced-motion
export const pageFadeSlide = {
  initial: { 
    opacity: 0, 
    y: checkReducedMotion() ? 0 : 8 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: getTransition('normal')
  },
  exit: { 
    opacity: 0, 
    y: checkReducedMotion() ? 0 : -8,
    transition: getTransition('fast')
  }
};

export const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02
    }
  }
};

export const itemFadeSlide = {
  hidden: { 
    opacity: 0, 
    y: checkReducedMotion() ? 0 : 10 
  },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: getTransition('spring') 
  }
};

export const hoverCard = {
  hover: {
    y: checkReducedMotion() ? 0 : -4,
    scale: checkReducedMotion() ? 1 : 1.01,
    transition: getTransition('snappy')
  },
  tap: {
    scale: checkReducedMotion() ? 1 : 0.99,
    transition: { duration: 0.1 }
  }
};

export const buttonScale = {
  hover: {
    scale: checkReducedMotion() ? 1 : 1.02,
    transition: getTransition('fast')
  },
  tap: {
    scale: checkReducedMotion() ? 1 : 0.98,
    transition: { duration: 0.08 }
  }
};

export const shakeVariant = {
  shake: {
    x: [0, -4, 4, -4, 4, 0],
    transition: { duration: 0.4 }
  }
};
