/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Zap, Monitor, Terminal, Cpu } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-mono selection:bg-[#FF00FF] selection:text-white relative overflow-hidden">
      {/* Background FX */}
      <div className="noise" />
      <div className="scanline" />
      
      <header className="relative z-10 p-4 bg-black border-b-2 border-white flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-2 border-2 border-white bg-[#FF00FF] text-black tear-anim">
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter glitch" data-text="CYBER_VOID">
              CYBER_VOID
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#00FFFF]">
              STATUS: [UNSTABLE_CORE]
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center font-mono text-[10px] text-white/50 bg-white/5 px-4 py-2 border-l-4 border-[#00FFFF]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            <span>ROOT_ID: 0x8F2A</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>LOAD: 98.4%</span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex-1 grid lg:grid-cols-[1fr_400px] gap-8 p-6 max-w-[1600px] mx-auto w-full">
        {/* Game Sector */}
        <section className="flex items-center justify-center bg-white/5 pixel-border p-8 relative overflow-hidden">
          <div className="absolute top-2 left-2 text-[10px] text-white/20 uppercase tracking-[.5em]">Sector_01: Neural_Relay</div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tear-anim"
          >
            <SnakeGame />
          </motion.div>
        </section>

        {/* Control Sector */}
        <section className="flex flex-col gap-6">
          <div className="pixel-border p-6 bg-black flex flex-col gap-4">
            <h2 className="text-xl font-bold uppercase italic border-b border-white/20 pb-2 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-[#FF00FF]" />
              Audio_Buffer
            </h2>
            <MusicPlayer />
          </div>

          <div className="p-4 border-2 border-dashed border-white/20 flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] text-[#00FFFF] uppercase tracking-widest">
              <span>Memory_Dump</span>
              <span>[0.00ms]</span>
            </div>
            <div className="h-32 bg-white/5 overflow-y-auto p-2 text-[10px] font-mono text-white/40 space-y-1">
              <p>{`> INITIALIZING_KERNEL... DONE`}</p>
              <p>{`> MAPPING_NEURAL_PATHWAY... WARN`}</p>
              <p>{`> FRAGMENT_COLLECTED: ID_5239`}</p>
              <p>{`> RECOGNIZING_AUDIO_PATTERN...`}</p>
              <p className="text-[#FF00FF]">{`> ERROR: SYSTEM_BLEED_DETECTED`}</p>
              <p>{`> ATTEMPTING_HOTFIX_v4.1...`}</p>
              <p className="text-[#00FFFF]">{`> FEED_SYNCED`}</p>
            </div>
          </div>

          <div className="mt-auto p-4 bg-[#00FFFF] text-black font-black uppercase text-center rotate-1 hover:rotate-0 transition-transform cursor-help">
            DON'T LET THE GRID DISSOLVE
          </div>
        </section>
      </main>

      <footer className="relative z-10 p-2 text-center text-[8px] uppercase tracking-[1em] text-white/20 bg-black mix-blend-difference">
        SYS_LOG: TIME_ELAPSED_ERR_0x000F
      </footer>
    </div>
  );
}
