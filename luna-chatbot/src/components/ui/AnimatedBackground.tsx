"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const flowers: string[] = ['🌸', '🌺', '🌷', '💮', '💖'];

interface FlowerProps {
  character: string;
  index: number;
}

const Flower: React.FC<FlowerProps> = ({ character, index }) => {
  const [animationProps, setAnimationProps] = useState({
    duration: 20,
    delay: 0,
    left: '50%',
    size: 20,
    initialRotate: 0,
    finalRotate: 180
  });

  useEffect(() => {
    // Generate random values only on the client side after mount
    const duration = Math.random() * 10 + 15; // 15-25 seconds
    const delay = Math.random() * 15; // 0-15 seconds
    const left = `${Math.random() * 100}%`;
    const size = Math.random() * 20 + 10; // 10px-30px
    const initialRotate = Math.random() * 360;
    const finalRotate = initialRotate + (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 90 + 45);

    setAnimationProps({
      duration,
      delay,
      left,
      size,
      initialRotate,
      finalRotate
    });
  }, []);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: animationProps.left,
        fontSize: `${animationProps.size}px`,
        color: 'rgba(233, 30, 99, 0.2)', // Soft pink color
        textShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
      }}
      initial={{ bottom: '-50px', opacity: 0, rotate: animationProps.initialRotate }}
      animate={{
        bottom: '100%',
        opacity: [0, 1, 1, 0],
        rotate: animationProps.finalRotate
      }}
      transition={{
        duration: animationProps.duration,
        delay: animationProps.delay,
        repeat: Infinity,
        repeatType: 'loop',
        ease: "linear"
      }}
    >
      {character}
    </motion.div>
  );
};

const AnimatedBackground: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden pointer-events-none">
      {Array.from({ length: 15 }).map((_, index: number) => (
        <Flower key={index} character={flowers[index % flowers.length]} index={index} />
      ))}
    </div>
  );
};

export default AnimatedBackground;