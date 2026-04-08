import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, MousePointerClick, Route, Volume2 } from 'lucide-react';

interface WelcomeOverlayProps {
  townName: string;
  region: string;
  visible: boolean;
  onClose: () => void;
}

export function WelcomeOverlay({ townName, region, visible, onClose }: WelcomeOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute inset-0 z-[80] flex flex-col items-center justify-center px-5 pointer-events-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />

          {/* Content card */}
          <motion.div
            className="relative z-10 w-full max-w-[400px] rounded-xl overflow-hidden shadow-lg"
            style={{
              background: 'rgba(26,26,26,0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ delay: 0.15, type: 'spring', damping: 30, stiffness: 280, mass: 0.8 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--color-text-muted)',
              }}
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Header */}
            <div className="px-5 pt-8 pb-5 text-center sm:px-8 sm:pt-10 sm:pb-6">
              <motion.p
                className="text-[0.75rem] uppercase tracking-[0.35em] mb-3"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Welcome to
              </motion.p>

              <motion.h1
                className="text-[clamp(1.8rem,7vw,2.8rem)] leading-[1.1] mb-3"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text)',
                }}
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.7, type: 'spring', damping: 20 }}
              >
                {townName}
              </motion.h1>

              <motion.p
                className="text-[0.8rem] tracking-[0.2em] uppercase"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-accent)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {region}
              </motion.p>

              <motion.div
                className="mx-auto mt-4 h-px bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent"
                style={{ width: '50px' }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.4, scaleX: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              />
            </div>

            {/* Instructions */}
            <motion.div
              className="px-5 pb-6 sm:px-8 sm:pb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.5 }}
            >
              <p
                className="text-[0.8rem] uppercase tracking-[0.2em] mb-5"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text-muted)' }}
              >
                How it works
              </p>

              <div className="flex flex-col gap-4">
                <Instruction
                  icon={<MapPin className="w-3.5 h-3.5" />}
                  text="Tap a marker on the map to learn about each heritage site"
                />
                <Instruction
                  icon={<Volume2 className="w-3.5 h-3.5" />}
                  text="Listen to an audio tour at each stop"
                />
                <Instruction
                  icon={<Route className="w-3.5 h-3.5" />}
                  text="Start the walking tour for a guided flythrough between stops"
                />
                <Instruction
                  icon={<MousePointerClick className="w-3.5 h-3.5" />}
                  text="Pinch to zoom and drag to explore the map freely"
                />
              </div>

              {/* Dismiss button */}
              <button
                className="w-full mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[0.85rem] font-medium tracking-[0.03em] transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] shadow-lg sm:mt-7 sm:py-3.5 sm:text-[0.9rem]"
                style={{
                  background: 'rgba(26,26,26,0.75)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(212,165,116,0.25)',
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)',
                }}
                onClick={onClose}
              >
                Explore the Map
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Instruction({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3.5">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
        style={{
          background: 'rgba(212,165,116,0.08)',
          border: '1px solid rgba(212,165,116,0.15)',
          color: 'var(--color-accent)',
        }}
      >
        {icon}
      </div>
      <p
        className="text-[0.78rem] leading-[1.6] sm:text-[0.85rem]"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
      >
        {text}
      </p>
    </div>
  );
}
