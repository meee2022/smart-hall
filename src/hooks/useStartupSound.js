import { useEffect, useState, useRef } from 'react';

export function useStartupSound() {
  const [played, setPlayed] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (played) return;

    const playSound = async () => {
      setPlayed(true);
      document.removeEventListener('click', playSound);
      
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        // C Major Pentatonic scale (C, D, E, G, A) across higher octaves for a sweet, music-box / wind-chime feel
        const frequencies = [
          392.00, // G4
          440.00, // A4
          523.25, // C5
          587.33, // D5
          659.25, // E5
          783.99, // G5
          880.00, // A5
          1046.50 // C6
        ];

        let nextNoteTime = ctx.currentTime + 0.05; // Start immediately after click
        const secondsPerBeat = 0.5; // Relaxing, slightly faster tempo

        const playNote = (time, freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine'; // pure, sweet tone
          osc.frequency.value = freq;
          
          // Sweet, bell-like envelope: soft ping that rings out nicely
          gain.gain.setValueAtTime(0, time);
          gain.gain.linearRampToValueAtTime(0.2, time + 0.02); // Louder attack (0.2)
          gain.gain.exponentialRampToValueAtTime(0.001, time + 3.0); // Long fade out
          
          // A bit of stereo panning to make it sound magical and spacious
          const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
          if (panner) {
            panner.pan.value = (Math.random() * 2) - 1; // Random pan left/right
            osc.connect(gain);
            gain.connect(panner);
            panner.connect(ctx.destination);
          } else {
            osc.connect(gain);
            gain.connect(ctx.destination);
          }
          
          osc.start(time);
          osc.stop(time + 3.5);
        };

        let firstNote = true;

        const scheduleNotes = () => {
          // Schedule ahead for the next 1 second
          while (nextNoteTime < ctx.currentTime + 1.0) {
            // Play a note 70% of the time, but always play the very first note
            if (firstNote || Math.random() < 0.7) {
              const randomFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
              playNote(nextNoteTime, randomFreq);
              firstNote = false;
            }
            // Advance by one beat
            nextNoteTime += secondsPerBeat;
          }
        };

        // Run the scheduler continuously
        scheduleNotes(); // Schedule immediately
        intervalRef.current = setInterval(scheduleNotes, 200);

      } catch (err) {
        console.warn("Audio playback failed or unsupported", err);
      }
    };

    // Browsers require user interaction before playing audio
    document.addEventListener('click', playSound, { once: true });
    
    return () => {
      document.removeEventListener('click', playSound);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [played]);
}
