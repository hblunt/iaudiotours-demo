import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { TourStop } from './types';
import { AudioPlayer } from './AudioPlayer';
import { X, FileText } from 'lucide-react';

interface StopModalProps {
  stop: TourStop | null;
  onClose: () => void;
}

export function StopModal({ stop, onClose }: StopModalProps) {
  const [showTranscription, setShowTranscription] = useState(false);

  // Reset transcription when stop changes
  const handleClose = () => {
    setShowTranscription(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {stop && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={handleClose}
          />

          {/* Card */}
          <motion.div
            className="relative z-10 w-full max-w-[420px] rounded-xl overflow-hidden shadow-lg"
            style={{
              background: 'rgba(26,26,26,0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--color-text-muted)',
              }}
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Image */}
            {stop.image && (
              <div className="relative w-full h-[200px] overflow-hidden">
                <img
                  src={stop.image}
                  alt={stop.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.style.display = 'none';
                  }}
                />
                {/* Bottom fade into card */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-20"
                  style={{ background: 'linear-gradient(to top, rgba(26,26,26,0.85), transparent)' }}
                />
              </div>
            )}

            {/* Content */}
            <div className="px-6 pb-6 pt-4" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {/* Accent line */}
              <motion.div
                className="h-px mb-4"
                style={{ background: 'linear-gradient(to right, var(--color-accent), transparent)' }}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
              />

              <h2
                className="text-lg mb-3 leading-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text)' }}
              >
                {stop.name}
              </h2>

              <p
                className="text-[0.8rem] leading-[1.7] mb-5"
                style={{ color: 'var(--color-text-muted)' }}
              >
                {stop.description}
              </p>

              <AudioPlayer src={stop.audio} />

              {/* Transcription toggle */}
              {stop.transcription && (
                <div className="mt-4">
                  <button
                    className="flex items-center gap-2 text-[0.75rem] font-medium transition-all duration-200 hover:opacity-80 active:scale-[0.98]"
                    style={{
                      color: 'var(--color-accent)',
                      fontFamily: 'var(--font-body)',
                    }}
                    onClick={() => setShowTranscription(!showTranscription)}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {showTranscription ? 'Hide Transcription' : 'View Transcription'}
                  </button>

                  <AnimatePresence>
                    {showTranscription && (
                      <motion.div
                        className="mt-3 pt-3"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <p
                          className="text-[0.75rem] leading-[1.8] whitespace-pre-line"
                          style={{ color: 'var(--color-text-muted)' }}
                        >
                          {stop.transcription}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
