import React, { useState, useEffect, useRef } from 'react';

const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3010/api' : '/api';

export default function WhatDoesThisDoVideo({ pageTitle, pageDescription, features = [], targetAudience, ctaUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [subtitle, setSubtitle] = useState('');
  
  const synthRef = useRef(null);
  const audioContextRef = useRef(null);
  const musicSourceRef = useRef(null);
  const timelineRef = useRef(null);
  const audioRef = useRef(null);
  const subtitleIntervalRef = useRef(null);

  // Fallback metadata scraping if props are not provided
  const title = pageTitle || (typeof document !== 'undefined' ? document.title : 'Syprian Tool');
  const desc = pageDescription || (typeof document !== 'undefined' && document.querySelector('meta[name="description"]') ? document.querySelector('meta[name="description"]').getAttribute('content') : 'This tool helps optimize educational compliance and workflows.');
  const audience = targetAudience || 'school districts, educators, and administrators';
  
  // Dynamic script compiler
  const scriptSlides = [
    {
      title: "Introducing " + title,
      content: `Welcome to the ${title} platform. Let's take a quick look at what this tool is and why it exists.`,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60",
      icon: "fa-rocket"
    },
    {
      title: "Who We Serve & Why We Exist",
      content: `${desc} We exist to serve ${audience}, helping you achieve compliance, clarity, and exceptional outcomes.`,
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60",
      icon: "fa-users"
    },
    {
      title: "Key Features & Capabilities",
      content: features.length > 0 
        ? `Here are the primary features of the platform: First, ${features[0] || 'Dynamic analysis'}. Second, ${features[1] || 'Unified management'}. And third, ${features[2] || 'Compliant auditing'}.`
        : `Key features include automated scanning, compliance tracking, high-fidelity metrics reporting, and multi-tenant secure dashboards.`,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
      icon: "fa-cubes",
      list: features.length > 0 ? features : ["Automated Compliance Scan", "Real-time Telemetry Dashboard", "Pre-flight Security Integrity Checks"]
    },
    {
      title: "Get Started & Outcomes",
      content: `By using this system, you can expect streamlined workflows and complete transparency. To get started, follow our guided tour or click the call to action below. Thank you.`,
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=60",
      icon: "fa-check-double"
    }
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopVideo();
    };
  }, []);

  const playBackgroundMusic = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Generate a soft ambient synthesizer tone using AudioNodes
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120, ctx.currentTime); // Soft low-frequency chord tone
      
      // Add standard LFO or soft pitch variations
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.25; // extremely slow oscillation
      lfoGain.gain.value = 1.5;
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      gain.gain.setValueAtTime(isMuted ? 0 : 0.08, ctx.currentTime); // Low volume (8%)

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      musicSourceRef.current = { osc, gain, filter, lfo };
    } catch (e) {
      console.warn("AudioContext background music generation failed:", e);
    }
  };

  const speakSlide = async (index) => {
    // Clean up any existing playback
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (subtitleIntervalRef.current) {
      clearInterval(subtitleIntervalRef.current);
      subtitleIntervalRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    const slide = scriptSlides[index];

    // Attempt ElevenLabs proxy stream
    try {
      const response = await fetch(`${API_BASE}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: slide.content })
      });

      if (response.ok && response.headers.get('content-type')?.includes('audio/mpeg')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        if (musicSourceRef.current && musicSourceRef.current.gain) {
          try {
            musicSourceRef.current.gain.gain.setValueAtTime(isMuted ? 0 : 0.02, audioContextRef.current.currentTime);
          } catch(err){}
        }

        audio.play();

        // Update subtitles on timer
        let wordIndex = 0;
        const words = slide.content.split(' ');
        setSubtitle(`"... ${words.slice(0, 5).join(' ')} ..."`);

        const totalWords = words.length;
        const totalDurationEstimateMs = totalWords * 350; // estimate time based on normal reading speed
        const intervalMs = Math.max(300, Math.min(600, totalDurationEstimateMs / (totalWords / 2)));

        subtitleIntervalRef.current = setInterval(() => {
          if (wordIndex < words.length) {
            const phrase = words.slice(Math.max(0, wordIndex - 4), Math.min(words.length, wordIndex + 4)).join(' ');
            setSubtitle(`"... ${phrase} ..."`);
            wordIndex += 2;
          } else {
            clearInterval(subtitleIntervalRef.current);
          }
        }, intervalMs);

        audio.onended = () => {
          if (musicSourceRef.current && musicSourceRef.current.gain) {
            try {
              musicSourceRef.current.gain.gain.setValueAtTime(isMuted ? 0 : 0.08, audioContextRef.current.currentTime);
            } catch(err){}
          }
          if (index < scriptSlides.length - 1) {
            const nextIdx = index + 1;
            setCurrentSlide(nextIdx);
            setProgress(((nextIdx + 1) / scriptSlides.length) * 100);
            speakSlide(nextIdx);
          } else {
            stopVideo();
          }
        };

        return; // ElevenLabs narration is handling it successfully
      }
    } catch (e) {
      console.warn("ElevenLabs TTS failed. Falling back to native SpeechSynthesis:", e);
    }

    // Fallback: Browser Speech Synthesis
    if (!synthRef.current) return;
    const utterance = new SpeechSynthesisUtterance(slide.content);
    const voices = synthRef.current.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('David') || v.name.includes('Mark'))) || voices[0];
    if (targetVoice) utterance.voice = targetVoice;
    
    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    if (musicSourceRef.current && musicSourceRef.current.gain) {
      try {
        musicSourceRef.current.gain.gain.setValueAtTime(isMuted ? 0 : 0.02, audioContextRef.current.currentTime);
      } catch(err){}
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const words = slide.content.split(' ');
        const charIdx = event.charIndex;
        let wordCount = 0;
        let charAcc = 0;
        for (let i = 0; i < words.length; i++) {
          charAcc += words[i].length + 1;
          if (charAcc >= charIdx) {
            wordCount = i;
            break;
          }
        }
        const phrase = words.slice(Math.max(0, wordCount - 4), Math.min(words.length, wordCount + 4)).join(' ');
        setSubtitle(`"... ${phrase} ..."`);
      }
    };

    utterance.onend = () => {
      if (musicSourceRef.current && musicSourceRef.current.gain) {
        try {
          musicSourceRef.current.gain.gain.setValueAtTime(isMuted ? 0 : 0.08, audioContextRef.current.currentTime);
        } catch(err){}
      }
      if (index < scriptSlides.length - 1) {
        const nextIdx = index + 1;
        setCurrentSlide(nextIdx);
        setProgress(((nextIdx + 1) / scriptSlides.length) * 100);
        speakSlide(nextIdx);
      } else {
        stopVideo();
      }
    };

    synthRef.current.speak(utterance);
  };

  const startVideo = () => {
    setIsPlaying(true);
    setCurrentSlide(0);
    setProgress((1 / scriptSlides.length) * 100);
    playBackgroundMusic();
    speakSlide(0);
  };

  const stopVideo = () => {
    setIsPlaying(false);
    setProgress(0);
    setCurrentSlide(0);
    setSubtitle('');
    if (synthRef.current) synthRef.current.cancel();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (subtitleIntervalRef.current) {
      clearInterval(subtitleIntervalRef.current);
      subtitleIntervalRef.current = null;
    }
    if (musicSourceRef.current) {
      try {
        musicSourceRef.current.osc.stop();
      } catch (e) {}
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (musicSourceRef.current && musicSourceRef.current.gain) {
      try {
        musicSourceRef.current.gain.gain.setValueAtTime(newMuted ? 0 : 0.08, audioContextRef.current.currentTime);
      } catch(err){}
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xl mt-12 transition-all hover:shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-black uppercase rounded-full tracking-widest flex items-center gap-1.5 w-fit">
            <i className="fa-solid fa-circle-info animate-pulse"></i> What Does This Do?
          </span>
          <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">Interactive Platform Explainer</h3>
        </div>
        <div className="flex gap-2">
          {isPlaying ? (
            <button onClick={stopVideo} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-all">
              <i className="fa-solid fa-stop"></i> Stop Presentation
            </button>
          ) : (
            <button onClick={startVideo} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              <i className="fa-solid fa-play"></i> Watch Explainer Video
            </button>
          )}
          <button onClick={toggleMute} className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all" title={isMuted ? "Unmute Music" : "Mute Music"}>
            <i className={`fa-solid ${isMuted ? 'fa-volume-mute' : 'fa-volume-high'}`}></i>
          </button>
        </div>
      </div>

      {/* Video Container (16:9) */}
      <div className="w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 shadow-inner flex flex-col justify-between">
        
        {/* Top bar */}
        <div className="p-4 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center z-10">
          <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> Dynamic AI Narration
          </span>
          <span className="text-[10px] font-black text-slate-300 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
            Slide {currentSlide + 1} / {scriptSlides.length}
          </span>
        </div>

        {/* Video Canvas Body */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          {isPlaying ? (
            <div className="w-full h-full relative flex items-center justify-center p-8">
              {/* Animated background image */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-sm transition-all duration-1000 scale-[1.05]"
                style={{ backgroundImage: `url(${scriptSlides[currentSlide].image})` }}
              ></div>

              {/* Foreground slide card */}
              <div className="w-full max-w-xl bg-white/95 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/20 flex flex-col md:flex-row items-center gap-6 z-10 transition-all duration-500 transform translate-y-0 scale-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg text-white text-2xl shrink-0">
                  <i className={`fa-solid ${scriptSlides[currentSlide].icon}`}></i>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-xl font-black text-slate-950 mb-2">{scriptSlides[currentSlide].title}</h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    {scriptSlides[currentSlide].content}
                  </p>
                  {scriptSlides[currentSlide].list && (
                    <ul className="mt-4 space-y-1.5 text-left inline-block">
                      {scriptSlides[currentSlide].list.map((item, idx) => (
                        <li key={idx} className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <i className="fa-solid fa-check text-emerald-500"></i> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 z-10 cursor-pointer w-full h-full" onClick={startVideo}>
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl text-white text-3xl mb-4 hover:scale-110 active:scale-95 transition-all">
                <i className="fa-solid fa-play ml-1"></i>
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight">Interactive AI Presentation</h4>
              <p className="text-sm text-slate-400 font-bold tracking-wide mt-1.5 max-w-sm uppercase">Click to play voice narration and platform walkthrough</p>
            </div>
          )}
        </div>

        {/* Captions Overlay */}
        {isPlaying && subtitle && (
          <div className="p-4 bg-gradient-to-t from-black/80 to-transparent text-center z-10">
            <span className="inline-block bg-black/60 px-4 py-2 rounded-xl text-yellow-300 text-xs md:text-sm font-black tracking-wide border border-white/5 shadow-2xl leading-normal">
              {subtitle}
            </span>
          </div>
        )}

        {/* Bottom Timeline Controls */}
        <div className="p-4 bg-gradient-to-t from-black/80 to-transparent flex items-center gap-4 z-10 border-t border-white/5">
          <button onClick={isPlaying ? stopVideo : startVideo} className="text-white hover:text-blue-400 transition-colors">
            <i className={`fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
          </button>
          
          <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>

          <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">
            {isPlaying ? 'ACTIVE' : '00:00'}
          </span>
        </div>
      </div>
    </div>
  );
}
