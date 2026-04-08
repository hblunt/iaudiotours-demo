import { motion, AnimatePresence } from 'motion/react';
import { Play, SkipForward, X, MapPin } from 'lucide-react';

interface SimulationControlsProps {
  active: boolean;
  currentIndex: number;
  totalStops: number;
  isLastStop: boolean;
  onStart: () => void;
  onNext: () => void;
  onExit: () => void;
}

const glass = {
  background: 'rgba(26,26,26,0.75)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
} as const;

const accentGlass = {
  background: 'rgba(26,26,26,0.75)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(212,165,116,0.25)',
} as const;

export function SimulationControls({
  active,
  currentIndex,
  totalStops,
  isLastStop,
  onStart,
  onNext,
  onExit,
}: SimulationControlsProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-auto">
      <AnimatePresence mode="wait">
        {!active ? (
          <motion.div
            key="start"
            className="flex justify-center pb-16 pt-20"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.55), transparent)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            <button
              className="flex items-center gap-2.5 px-10 py-4 rounded-xl text-[0.85rem] font-medium tracking-[0.03em] transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
              style={{
                ...accentGlass,
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
              }}
              onClick={onStart}
            >
              <Play className="w-3.5 h-3.5 fill-current" style={{ color: 'var(--color-accent)' }} />
              Start Walking Tour
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="controls"
            className="flex items-center justify-between px-5 pb-12 pt-14"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          >
            {/* Exit */}
            <button
              className="flex items-center gap-1.5 px-4 h-9 rounded-xl text-[0.7rem] font-medium tracking-wide transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
              style={{
                ...glass,
                color: 'var(--color-text-muted)',
                fontFamily: 'var(--font-body)',
              }}
              onClick={onExit}
            >
              <X className="w-3 h-3" />
              Exit
            </button>

            {/* Stop counter */}
            <motion.div
              className="flex items-center gap-1.5 text-[0.7rem]"
              style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-body)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 }}
            >
              <MapPin className="w-3 h-3" style={{ color: 'var(--color-accent)' }} />
              <span className="tabular-nums font-medium">
                {currentIndex + 1}
                <span className="opacity-30 mx-0.5">/</span>
                {totalStops}
              </span>
            </motion.div>

            {/* Next */}
            {!isLastStop && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 }}
              >
                <button
                  className="flex items-center gap-1.5 px-5 h-9 rounded-xl text-[0.7rem] font-medium tracking-wide transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 shadow-lg"
                  style={{
                    ...accentGlass,
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onClick={onNext}
                >
                  Next Stop
                  <SkipForward className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
