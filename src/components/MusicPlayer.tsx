/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Music, Activity } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'VOID_PULSE_01',
    artist: 'KERNEL_v4',
    duration: 180,
    url: 'https://cdn.pixabay.com/audio/2022/10/18/audio_3195f30af2.mp3',
    color: '#00FFFF'
  },
  {
    id: '2',
    title: 'CYBER_SYNTH_X',
    artist: 'REPL_BOOT',
    duration: 210,
    url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_3174581ed3.mp3',
    color: '#FF00FF'
  },
  {
    id: '3',
    title: 'GLITCH_BASS_8',
    artist: 'SYS_OVERRIDE',
    duration: 165,
    url: 'https://cdn.pixabay.com/audio/2021/11/23/audio_0de9b00796.mp3',
    color: '#FFFFFF'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setCurrentTime(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setCurrentTime(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / currentTrack.duration) * 100;

  return (
    <div className="w-full space-y-6">
      <audio 
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
      />
      
      <div className="flex gap-4">
        <motion.div 
          className="w-20 h-20 bg-white p-1 pixel-border flex-shrink-0"
          animate={{
            skew: isPlaying ? [0, 10, -10, 0] : 0,
            scale: isPlaying ? [1, 1.05, 1] : 1
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
        >
          <div className="w-full h-full bg-black flex items-center justify-center overflow-hidden relative">
            <Music className="w-8 h-8 text-white opacity-50" />
            <div className="noise opacity-40" />
          </div>
        </motion.div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black uppercase tracking-tighter truncate glitch drop-shadow-[2px_2px_0px_#FF00FF]" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-[10px] uppercase font-mono text-[#00FFFF] mb-4">
            STREAM_AUTH: {currentTrack.artist}
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={prevTrack}
              className="p-2 border-2 border-white hover:bg-[#FF00FF] hover:text-black transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button 
              onClick={togglePlay}
              className="flex-1 py-2 flex items-center justify-center border-2 border-white bg-white text-black font-black uppercase text-xs hover:bg-[#00FFFF] transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span className="ml-2">{isPlaying ? 'SUSPEND' : 'EXECUTE'}</span>
            </button>
            <button 
              onClick={nextTrack}
              className="p-2 border-2 border-white hover:bg-[#FF00FF] hover:text-black transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[8px] font-mono text-white/50 uppercase">
          <span>{formatTime(currentTime)}</span>
          <Activity className={`w-3 h-3 ${isPlaying ? 'animate-pulse text-[#00FFFF]' : 'opacity-20'}`} />
          <span>{formatTime(currentTrack.duration)}</span>
        </div>
        <div className="h-4 bg-white/10 border-2 border-white relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-[#FF00FF]"
            style={{ width: `${progress}%` }}
            transition={{ ease: "linear" }}
          />
          {/* Progress Markers */}
          <div className="absolute inset-0 flex justify-between pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-black/20" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
