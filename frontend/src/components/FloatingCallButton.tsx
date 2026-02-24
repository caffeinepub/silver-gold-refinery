import { Phone, X } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';

export default function FloatingCallButton() {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const phoneNumber = '95185 53890';
  const telLink = 'tel:+919518553890';
  
  // Initialize position from sessionStorage or use default
  const getInitialPosition = () => {
    const saved = sessionStorage.getItem('floatingButtonPosition');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default: right edge, vertically centered
    return {
      x: window.innerWidth - 80,
      y: window.innerHeight / 2 - 28
    };
  };

  const [position, setPosition] = useState(getInitialPosition);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Save position to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('floatingButtonPosition', JSON.stringify(position));
  }, [position]);

  // Handle window resize to keep button in bounds
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    setDragDistance(0);
    e.preventDefault();
  }, [position]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    setDragDistance(0);
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Calculate drag distance
    const distance = Math.sqrt(
      Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2)
    );
    setDragDistance(distance);
    
    // Keep button within viewport bounds
    const boundedX = Math.max(0, Math.min(newX, window.innerWidth - 80));
    const boundedY = Math.max(0, Math.min(newY, window.innerHeight - 80));
    
    setPosition({ x: boundedX, y: boundedY });
  }, [isDragging, dragStart, position]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;
    
    // Calculate drag distance
    const distance = Math.sqrt(
      Math.pow(newX - position.x, 2) + Math.pow(newY - position.y, 2)
    );
    setDragDistance(distance);
    
    // Keep button within viewport bounds
    const boundedX = Math.max(0, Math.min(newX, window.innerWidth - 80));
    const boundedY = Math.max(0, Math.min(newY, window.innerHeight - 80));
    
    setPosition({ x: boundedX, y: boundedY });
  }, [isDragging, dragStart, position]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Prevent navigation if user was dragging
    if (dragDistance >= 5) {
      e.preventDefault();
    }
  }, [dragDistance]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div
      ref={buttonRef}
      className="fixed z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none'
      }}
    >
      <a
        href={telLink}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
        className="flex h-14 w-14 rounded-full bg-green-600 shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 border-2 border-green-500/50 group items-center justify-center"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        aria-label={`Call ${phoneNumber}`}
      >
        <Phone className="h-6 w-6 text-white group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
}
