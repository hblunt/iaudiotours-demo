"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const PinContainer = ({
  title,
  stopId,
  containerClassName,
  onClick,
}: {
  title?: string;
  stopId?: string;
  containerClassName?: string;
  onClick?: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [zoomActive, setZoomActive] = useState(false);
  const active = hovered || zoomActive;

  useEffect(() => {
    const handler = (e: Event) => {
      const { activeIds } = (e as CustomEvent).detail as { activeIds: string[] };
      setZoomActive(stopId ? activeIds.includes(stopId) : false);
    };
    window.addEventListener('pin-zoom-activate', handler);
    return () => window.removeEventListener('pin-zoom-activate', handler);
  }, [stopId]);

  return (
    <div
      className={cn(
        "relative z-50 cursor-pointer w-8 h-8",
        containerClassName
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Always-visible pin dot */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[70]">
        {/* Outer pulse ring */}
        <motion.div
          className="absolute inset-[-10px] rounded-full"
          style={{ background: 'rgba(34,197,94,0.15)' }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Inner glow ring */}
        <motion.div
          className="absolute inset-[-5px] rounded-full"
          style={{
            border: '2px solid rgba(34,197,94,0.45)',
            boxShadow: '0 0 10px rgba(34,197,94,0.3)',
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Core dot */}
        <motion.div
          className="w-3.5 h-3.5 rounded-full"
          style={{
            background: 'radial-gradient(circle, #4ade80, #22c55e)',
            boxShadow: '0 0 12px rgba(34,197,94,0.7), 0 0 24px rgba(34,197,94,0.3), 0 0 4px rgba(255,255,255,0.4) inset',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-visible pointer-events-none">
        <PinPerspective title={title} active={active} />
      </div>
    </div>
  );
};

export const PinPerspective = ({
  title,
  active,
}: {
  title?: string;
  active: boolean;
}) => {
  return (
    <motion.div
      className="pointer-events-none w-48 h-40 flex items-center justify-center z-[60]"
      initial={{ opacity: 0 }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div className="w-full h-full flex-none inset-0 relative">
        {/* Title label on hover */}
        <div className="absolute top-0 inset-x-0 flex justify-center">
          <span
            className="relative flex items-center z-10 rounded-xl px-4 py-1.5 shadow-lg whitespace-nowrap"
            style={{
              background: 'rgba(26,26,26,0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(212,165,116,0.25)',
              fontFamily: 'var(--font-body)',
            }}
          >
            <span
              className="relative z-20 text-xs font-medium tracking-[0.03em]"
              style={{ color: 'var(--color-text)' }}
            >
              {title}
            </span>
          </span>
        </div>

        {/* Pulse rings */}
        <div
          style={{
            perspective: "1000px",
            transform: "rotateX(70deg) translateZ(0)",
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
            animate={{ opacity: [0, 1, 0.5, 0], scale: 1, z: 0 }}
            transition={{ duration: 6, repeat: Infinity, delay: 0 }}
            className="absolute left-1/2 top-1/2 h-[6rem] w-[6rem] rounded-[50%] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            style={{ background: 'rgba(34,197,94,0.08)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
            animate={{ opacity: [0, 1, 0.5, 0], scale: 1, z: 0 }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            className="absolute left-1/2 top-1/2 h-[6rem] w-[6rem] rounded-[50%] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            style={{ background: 'rgba(34,197,94,0.08)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
            animate={{ opacity: [0, 1, 0.5, 0], scale: 1, z: 0 }}
            transition={{ duration: 6, repeat: Infinity, delay: 4 }}
            className="absolute left-1/2 top-1/2 h-[6rem] w-[6rem] rounded-[50%] shadow-[0_8px_16px_rgb(0_0_0/0.4)]"
            style={{ background: 'rgba(34,197,94,0.08)' }}
          />
        </div>

        {/* Pin line */}
        <motion.div
          className="absolute right-1/2 bottom-1/2 translate-y-[14px] w-px blur-[2px]"
          animate={{ height: active ? 96 : 48 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(to bottom, transparent, #22c55e)' }}
        />
        <motion.div
          className="absolute right-1/2 bottom-1/2 translate-y-[14px] w-px"
          animate={{ height: active ? 96 : 48 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{ background: 'linear-gradient(to bottom, transparent, #22c55e)' }}
        />
        <motion.div
          className="absolute right-1/2 translate-x-[1.5px] bottom-1/2 translate-y-[14px] w-[4px] h-[4px] rounded-full z-40 blur-[3px]"
          style={{ background: '#22c55e' }}
        />
        <motion.div
          className="absolute right-1/2 translate-x-[0.5px] bottom-1/2 translate-y-[14px] w-[2px] h-[2px] rounded-full z-40"
          style={{ background: '#F5F0EB' }}
        />
      </div>
    </motion.div>
  );
};
