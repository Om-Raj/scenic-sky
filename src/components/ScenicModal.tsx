'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import type { ScenicLocation } from '@/lib/seat-recommendation-types';
import Image from 'next/image';

interface ScenicModalProps {
  scenicLocation: ScenicLocation;
}

/**
 * Animated tooltip modal component for displaying scenic location information
 * Visually anchored above the centered airplane icon
 */
export function ScenicModal({ scenicLocation }: ScenicModalProps) {
  // const modalStyle = {
  //   left: '50%',
  //   top: '40%', // Position above center where airplane is located
  //   transform: 'translateX(-50%)', // Center horizontally
  //   zIndex: 1000,
  //   pointerEvents: 'none' as const, // Prevent interaction since no buttons
  // };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ 
        duration: 0.2,
        ease: [0.4, 0.0, 0.2, 1]
      }}
      className="absolute z-50 max-w-xs"
      // style={modalStyle}
    >
      {/* // Tooltip arrow pointing down to airplane
      <div 
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
        style={{
          width: 0,
          height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid rgb(255 255 255 / 0.95)',
        }}
      /> */}
      
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 overflow-hidden">
        <div className="relative w-full h-24">
          <Image
            src="/sun-flare.png"
            alt={scenicLocation.name}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover"
            priority={false}
          />
        </div>
        
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-sm font-semibold text-gray-900 leading-tight">
            {scenicLocation.name}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0 pb-3">
          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {scenicLocation.description || `Beautiful ${scenicLocation.type} worth seeing during your flight.`}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {scenicLocation.type}
            </span>
            
            <div className="flex items-center space-x-1 text-xs text-red-500">
              <Heart className="w-3 h-3 fill-current" />
              <span className="font-medium">
                {(scenicLocation.likes / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
