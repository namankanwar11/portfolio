const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'public', 'sounds');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function writeWav(filename, samples, sampleRate = 44100) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  
  const buffer = Buffer.alloc(44 + dataSize);
  
  // RIFF Chunk Descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  
  // fmt sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bytesPerSample * 8, 34);
  
  // data sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);
  
  for (let i = 0; i < samples.length; i++) {
    // clamp and convert to 16-bit PCM
    let s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(s * 32767), 44 + i * 2);
  }
  
  fs.writeFileSync(path.join(outDir, filename), buffer);
  console.log(`Generated ${filename}`);
}

const SR = 44100;

// 1. Hover Beep (short high-tech blip)
let hover = [];
for(let i=0; i<SR*0.05; i++) {
  const t = i/SR;
  // exponential decay envelope
  const env = Math.exp(-t * 80);
  hover.push(Math.sin(2 * Math.PI * 1200 * t) * env * 0.3);
}
writeWav('hover.wav', hover);

// 2. Click (solid mechanical tech click)
let click = [];
for(let i=0; i<SR*0.08; i++) {
  const t = i/SR;
  const env = Math.exp(-t * 60);
  // pitch slide down
  const f = 800 * Math.exp(-t * 100);
  click.push(Math.sin(2 * Math.PI * f * t) * env * 0.4);
}
writeWav('click.wav', click);

// 3. Unlock (arpeggio / power up)
let unlock = [];
const notes = [440, 554.37, 659.25, 880]; // A major arp
for(let i=0; i<SR*0.6; i++) {
  const t = i/SR;
  const noteIdx = Math.floor(t * 4 / 0.6);
  if (noteIdx < 4) {
    const f = notes[noteIdx];
    const env = 1 - ((t % 0.15) / 0.15); // sawtooth env per note
    unlock.push(Math.sin(2 * Math.PI * f * t) * env * 0.3);
  }
}
writeWav('unlock.wav', unlock);

// 4. Transform / Hover Game Node
let transition = [];
for(let i=0; i<SR*1.5; i++) {
  const t = i/SR;
  const env = Math.sin(t / 1.5 * Math.PI);
  const f = 100 + t * 400; // pitch sweep up
  // add some FM modulation
  const mod = Math.sin(2 * Math.PI * 15 * t) * 0.2;
  transition.push(Math.sin(2 * Math.PI * (f + mod*100) * t) * env * 0.3);
}
writeWav('transition.wav', transition);

// 5. Scroll sweep (digital noise burst, filtered)
let scroll = [];
let lastOut = 0;
for(let i=0; i<SR*0.1; i++) {
  const t = i/SR;
  const env = Math.exp(-t * 20);
  const noise = Math.random() * 2 - 1;
  // simple lowpass filter sweeping up
  const cutoff = 0.05 + t * 0.5; 
  lastOut += (noise - lastOut) * cutoff;
  scroll.push(lastOut * env * 0.15);
}
writeWav('scroll.wav', scroll);

// 6. Ambient (low drone, 6 seconds looping)
let ambient = [];
const ambLen = 6 * SR;
for(let i=0; i<ambLen; i++) {
  const t = i/SR;
  // Drone with multiple detuned sine waves + slow LFO
  const lfo = Math.sin(2 * Math.PI * (1/6) * t) * 0.5 + 0.5;
  const wave1 = Math.sin(2 * Math.PI * 55 * t);
  const wave2 = Math.sin(2 * Math.PI * 55.4 * t);
  const wave3 = Math.sin(2 * Math.PI * 110 * t) * 0.4;
  
  // ensure seamless loop
  const fade = (t < 0.1) ? t/0.1 : (t > 5.9) ? (6-t)/0.1 : 1;
  ambient.push((wave1 + wave2 + wave3) * lfo * fade * 0.15);
}
writeWav('ambient.wav', ambient);
