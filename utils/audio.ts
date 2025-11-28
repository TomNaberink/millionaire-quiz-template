// Simple Web Audio API Synth to avoid external file dependencies
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) => {
  if (!audioCtx) return;
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.value = freq;
  
  gain.gain.setValueAtTime(vol, audioCtx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(audioCtx.currentTime + startTime);
  osc.stop(audioCtx.currentTime + startTime + duration);
};

export const playSound = (type: 'lock' | 'correct' | 'wrong' | 'start') => {
  const ctx = initAudio();
  if (!ctx) return;

  switch (type) {
    case 'start':
      // Rising swell
      playTone(200, 'sine', 1, 0, 0.2);
      playTone(400, 'triangle', 1, 0.2, 0.2);
      break;
    case 'lock':
      // Dramatic Thud/Boom
      playTone(100, 'sawtooth', 0.5, 0, 0.2);
      playTone(50, 'sine', 0.8, 0, 0.5);
      break;
    case 'correct':
      // Success Chime (Major chord)
      playTone(523.25, 'sine', 0.6, 0, 0.2); // C5
      playTone(659.25, 'sine', 0.6, 0.1, 0.2); // E5
      playTone(783.99, 'sine', 0.8, 0.2, 0.2); // G5
      playTone(1046.50, 'triangle', 1.0, 0.3, 0.1); // C6
      break;
    case 'wrong':
      // Fail sound (Dissonant / Descending)
      playTone(300, 'sawtooth', 0.8, 0, 0.3);
      playTone(290, 'sawtooth', 0.8, 0.1, 0.3);
      playTone(200, 'sine', 1.0, 0.2, 0.4);
      break;
  }
};