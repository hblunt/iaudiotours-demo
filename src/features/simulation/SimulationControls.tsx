import './SimulationControls.css';

interface SimulationControlsProps {
  active: boolean;
  currentIndex: number;
  totalStops: number;
  isLastStop: boolean;
  onStart: () => void;
  onNext: () => void;
  onExit: () => void;
}

export function SimulationControls({
  active,
  currentIndex,
  totalStops,
  isLastStop,
  onStart,
  onNext,
  onExit,
}: SimulationControlsProps) {
  if (!active) {
    return (
      <div className="sim-bar">
        <button className="sim-btn sim-btn-primary" onClick={onStart}>
          Start Walking Tour
        </button>
      </div>
    );
  }

  return (
    <div className="sim-bar">
      <button className="sim-btn sim-btn-exit" onClick={onExit}>
        Exit
      </button>
      <span className="sim-indicator">
        Stop {currentIndex + 1} of {totalStops}
      </span>
      {!isLastStop && (
        <button className="sim-btn sim-btn-primary" onClick={onNext}>
          Next Stop
        </button>
      )}
    </div>
  );
}
