import type { TourStop } from './types';
import { AudioPlayer } from './AudioPlayer';
import './StopModal.css';

interface StopModalProps {
  stop: TourStop | null;
  onClose: () => void;
}

export function StopModal({ stop, onClose }: StopModalProps) {
  if (!stop) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
        <h2 className="modal-title">{stop.name}</h2>
        {stop.image && (
          <img
            className="modal-image"
            src={stop.image}
            alt={stop.name}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        <p className="modal-description">{stop.description}</p>
        <AudioPlayer src={stop.audio} />
      </div>
    </div>
  );
}
