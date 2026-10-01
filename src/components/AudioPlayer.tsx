import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { AudioTrack } from '../content/types';
import Icon from './Icon';

export function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0:00';
  const seconds = Math.floor(value);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = String(seconds % 60).padStart(2, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${remainder}` : `${minutes}:${remainder}`;
}

interface Props {
  track: AudioTrack;
  register: (id: string, audio: HTMLAudioElement) => () => void;
  activate: (id: string) => void;
}

export default function AudioPlayer({ track, register, activate }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const pendingRef = useRef(false);
  const lastVolume = useRef(0.85);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const audio = audioRef.current!;
    audio.volume = 0.85;
    return register(track.id, audio);
  }, [register, track.id]);

  async function togglePlayback() {
    const audio = audioRef.current!;
    if (!audio.paused || pendingRef.current) {
      pendingRef.current = false;
      audio.pause();
      setLoading(false);
      return;
    }
    setError('');
    if (audio.error) audio.load();
    activate(track.id);
    pendingRef.current = true;
    setLoading(true);
    try {
      await audio.play();
    } catch (cause) {
      if (!(cause instanceof DOMException && cause.name === 'AbortError')) {
        setError('This recording could not start. Please try again, or open the audio file below.');
      }
    } finally {
      pendingRef.current = false;
      setLoading(false);
    }
  }

  function changeVolume(next: number) {
    audioRef.current!.volume = next;
    setVolume(next);
    if (next > 0) lastVolume.current = next;
  }

  function updateDuration() {
    const next = audioRef.current!.duration;
    setDuration(Number.isFinite(next) && next > 0 ? next : 0);
  }

  const actionLabel = playing || loading
    ? `Pause ${track.kind === 'song' ? 'the Chapter Song' : 'Chapter One'}`
    : track.playLabel;
  const progress = duration ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <article className={`audio-player audio-player--${track.kind}${playing ? ' is-playing' : ''}`} aria-label={track.title}>
      <audio
        ref={audioRef}
        src={track.url}
        preload="metadata"
        onLoadedMetadata={updateDuration}
        onDurationChange={updateDuration}
        onTimeUpdate={() => setPosition(audioRef.current!.currentTime)}
        onPlay={() => { activate(track.id); setPlaying(true); }}
        onPlaying={() => setLoading(false)}
        onPause={() => { pendingRef.current = false; setPlaying(false); setLoading(false); }}
        onWaiting={() => { if (!audioRef.current!.paused) setLoading(true); }}
        onEnded={() => { setPlaying(false); setLoading(false); }}
        onError={() => { setPlaying(false); setLoading(false); setError('This recording is temporarily unavailable. Try again, or open the audio file below.'); }}
      />
      <div className="player-heading">
        <span className="track-icon"><Icon name={track.kind === 'narration' ? 'headphones' : 'music'} /></span>
        <div>
          <p className="eyebrow track-kind">{track.kind === 'narration' ? 'The story' : 'The music'}</p>
          <h3>{track.title}</h3>
        </div>
        <span className="track-number" aria-hidden="true">{track.kind === 'narration' ? '01' : '02'}</span>
      </div>
      <p className="track-description">{track.subtitle}</p>
      <div className="seek-row">
        <input
          type="range"
          className="seek-slider"
          min="0"
          max={duration || 1}
          step="0.1"
          value={Math.min(position, duration || 1)}
          disabled={!duration}
          aria-label={`Seek in ${track.title}`}
          aria-valuetext={`${formatTime(position)} of ${duration ? formatTime(duration) : 'duration loading'}`}
          style={{ '--progress': `${progress}%` } as CSSProperties}
          onChange={(event) => {
            const next = Number(event.target.value);
            audioRef.current!.currentTime = next;
            setPosition(next);
          }}
        />
        <div className="time-labels"><span>{formatTime(position)}</span><span>{duration ? formatTime(duration) : '—:—'}</span></div>
      </div>
      <div className="player-controls">
        <button className="play-button" onClick={togglePlayback} aria-label={actionLabel}>
          <Icon name={playing || loading ? 'pause' : 'play'} />
          <span>{loading ? 'Loading audio…' : actionLabel}</span>
        </button>
        <div className="sound-controls">
          {track.kind === 'narration' && <label className="speed-control">
            <span className="sr-only">Narration playback speed</span>
            <select value={rate} onChange={(event) => { const next = Number(event.target.value); audioRef.current!.playbackRate = next; setRate(next); }}>
              <option value="0.75">0.75×</option><option value="1">1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option>
            </select>
          </label>}
          <button className="icon-button volume-toggle" aria-label={volume ? `Mute ${track.title}` : `Unmute ${track.title}`} onClick={() => changeVolume(volume ? 0 : lastVolume.current)}><Icon name={volume ? 'volume' : 'muted'} /></button>
          <input className="volume-slider" type="range" min="0" max="1" step="0.05" value={volume} aria-label={`Volume for ${track.title}`} aria-valuetext={`${Math.round(volume * 100)} percent`} onChange={(event) => changeVolume(Number(event.target.value))} />
        </div>
      </div>
      <span className="sr-only" role="status">{loading ? 'Loading audio' : playing ? `${track.title} playing` : `${track.title} paused`}</span>
      {error && <div className="audio-error" role="alert"><p>{error}</p><a href={track.url} target="_blank" rel="noreferrer">Open audio file</a></div>}
    </article>
  );
}
