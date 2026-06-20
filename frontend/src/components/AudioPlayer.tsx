import React, { useRef, useState } from 'react';
import { Play, Pause } from 'lucide-react';

export const AudioPlayer: React.FC<{ src: string }> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRate] = useState(1);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play();
    }
    setPlaying(!playing);
  };

  const handleRateChange = () => {
    const next = rate === 1 ? 1.5 : rate === 1.5 ? 0.75 : 1;
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  };

  return (
    <div className="rounded-xl border border-border bg-slate-50 p-3 flex items-center gap-3">
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
      <button
        type="button"
        onClick={togglePlay}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
      >
        {playing ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4 ml-0.5" fill="currentColor" />}
      </button>
      <div className="flex-1 text-sm text-text-muted">Weekly care audio</div>
      <button
        type="button"
        onClick={handleRateChange}
        className="rounded-lg border border-border px-2 py-1 text-xs font-semibold text-text"
      >
        {rate}x
      </button>
    </div>
  );
};
