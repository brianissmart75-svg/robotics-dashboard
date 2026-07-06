import React, { useState, useEffect } from 'react';
import WhatDoesThisDoVideo from './WhatDoesThisDoVideo';

export default function UserExperienceEnhancements({ pageTitle, pageDescription, tourSteps = [], faqs = [] }) {
  const [showBanner, setShowBanner] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTourActive, setIsTourActive] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);

  const title = pageTitle || "Syprian Platform";
  const desc = pageDescription || "educational compliance and workflow intelligence.";

  // Standard FAQ entries
  const defaultFaqs = [
    {
      q: "What is this platform?",
      a: `This is the ${title} module, a specialized system designed to optimize workflows, coordinate certifications, and automate auditing processes.`
    },
    {
      q: "How do I get started?",
      a: "Click on the 'Start Guided Tour' button in the help drawer or follow the walkthrough prompts. Use the 'What Does This Do?' explainer video to understand key concepts."
    },
    {
      q: "Is my data secure?",
      a: "Yes. All Syprian portals employ secure token authorization, end-to-end data encryption, and local database constraints ensuring complete compliance."
    },
    ...faqs
  ];

  // Standard Tour steps (will highlight selector elements if they exist, or show as a modal)
  const defaultTourSteps = [
    {
      title: `Welcome to ${title}`,
      text: `Let's take a quick look around the dashboard to get you oriented. Click next to continue.`,
      selector: "body"
    },
    {
      title: "Navigation Control",
      text: "You can transition between submodules and portals using the header navigation elements.",
      selector: "nav, header, .nav-container"
    },
    {
      title: "Platform Dashboard",
      text: "This section houses real-time analytics, compliance checkmarks, and operational status logs.",
      selector: ".glass-panel, .dashboard-container"
    },
    {
      title: "Interactive Utilities",
      text: "Take quizzes, upload certifications, print reports, or trigger AI agents using the quick action cards.",
      selector: ".grid, .card-container"
    },
    {
      title: "Need Help?",
      text: "You can relaunch this tour or watch the explainer video at any time by clicking the floating Help Button in the bottom-right.",
      selector: "#help-trigger-btn"
    },
    ...tourSteps
  ];

  // Check if target DOM elements exist for tour highlights
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    if (isTourActive) {
      const step = defaultTourSteps[tourStepIndex];
      const el = document.querySelector(step.selector);
      if (el) {
        const rect = el.getBoundingClientRect();
        setCurrentPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        });
        // Scroll element into view smoothly
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        setCurrentPosition(null); // Fallback to centered modal
      }
    }
  }, [isTourActive, tourStepIndex]);

  const handleNextStep = () => {
    if (tourStepIndex < defaultTourSteps.length - 1) {
      setTourStepIndex(tourStepIndex + 1);
    } else {
      endTour();
    }
  };

  const handlePrevStep = () => {
    if (tourStepIndex > 0) {
      setTourStepIndex(tourStepIndex - 1);
    }
  };

  const startTour = () => {
    setIsTourActive(true);
    setTourStepIndex(0);
    setIsDrawerOpen(false);
  };

  const endTour = () => {
    setIsTourActive(false);
    setTourStepIndex(0);
    setCurrentPosition(null);
  };

  return (
    <>
      {/* 1. Welcome Banner */}
      {showBanner && (
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-3.5 flex justify-between items-center text-xs md:text-sm font-bold shadow-md z-40 relative animate-fade-in border-b border-indigo-500/20">
          <div className="flex items-center gap-2.5 mx-auto">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider flex items-center gap-1">
              <i className="fa-solid fa-sparkles animate-pulse"></i> New
            </span>
            <span>Welcome to {title}! 🚀 We've upgraded this platform to Light Mode and added new interactive tours.</span>
            <button onClick={startTour} className="bg-white text-indigo-700 px-3 py-1 rounded-lg hover:bg-slate-100 transition-all font-black text-xs">
              Start Tour
            </button>
          </div>
          <button onClick={() => setShowBanner(false)} className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-full transition-all shrink-0">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
      )}

      {/* 2. Floating Help Button */}
      <button 
        id="help-trigger-btn"
        onClick={() => setIsDrawerOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 border border-white/15"
        title="Support & Info Dashboard"
      >
        <i className="fa-solid fa-question text-xl"></i>
      </button>

      {/* 3. Support & FAQ Side Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
          
          {/* Drawer Panel */}
          <div className="w-full md:w-96 bg-white h-full relative z-10 shadow-2xl border-l border-slate-200 flex flex-col p-6 overflow-y-auto animate-slide-up md:animate-none">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-6">
              <h4 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-life-ring text-blue-600"></i> Help & Resources
              </h4>
              <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-all">
                <i className="fa-solid fa-times text-lg"></i>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 mb-8">
              <button onClick={startTour} className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-md">
                <i className="fa-solid fa-compass"></i> Start 1-Minute Guided Tour
              </button>
            </div>

            {/* Explainer Video section in Drawer */}
            <div className="mb-8 border-b border-slate-100 pb-6">
              <h5 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <i className="fa-solid fa-video text-blue-500"></i> Explainer Video
              </h5>
              <WhatDoesThisDoVideo pageTitle={title} pageDescription={desc} />
            </div>

            {/* FAQ Accordion */}
            <div>
              <h5 className="font-black text-slate-800 text-sm uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <i className="fa-solid fa-circle-question text-blue-500"></i> FAQ Section
              </h5>
              <div className="space-y-3">
                {defaultFaqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <button 
                      onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                      className="w-full flex justify-between items-center p-3 text-left hover:bg-slate-100/50 transition-colors"
                    >
                      <span className="text-xs font-black text-slate-800 pr-4">{faq.q}</span>
                      <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform ${faqOpenIndex === idx ? 'rotate-180' : ''}`}></i>
                    </button>
                    {faqOpenIndex === idx && (
                      <div className="px-3 pb-3 text-xs text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Interactive Guided Tour Tooltip */}
      {isTourActive && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          {/* Dimmed backdrop wrapping everything */}
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]"></div>
          
          {/* Highlight Target Overlay box */}
          {currentPosition && (
            <div 
              className="absolute border-2 border-blue-500 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] rounded-lg pointer-events-auto transition-all duration-300"
              style={{
                top: currentPosition.top - window.scrollY - 4,
                left: currentPosition.left - window.scrollX - 4,
                width: currentPosition.width + 8,
                height: currentPosition.height + 8
              }}
            ></div>
          )}

          {/* Tour Step Tooltip card */}
          <div 
            className="fixed bg-white border border-slate-200 rounded-2xl p-5 shadow-2xl z-50 pointer-events-auto flex flex-col justify-between max-w-sm w-80 transition-all duration-300"
            style={
              currentPosition 
                ? {
                    top: Math.min(window.innerHeight - 250, Math.max(20, currentPosition.top - window.scrollY + currentPosition.height + 16)),
                    left: Math.min(window.innerWidth - 340, Math.max(20, currentPosition.left - window.scrollX + (currentPosition.width/2) - 160))
                  }
                : {
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                  }
            }
          >
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black text-blue-600 tracking-widest uppercase">
                Step {tourStepIndex + 1} of {defaultTourSteps.length}
              </span>
              <button onClick={endTour} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fa-solid fa-times text-xs"></i>
              </button>
            </div>
            
            <h4 className="text-sm font-black text-slate-900 mb-1.5">
              {defaultTourSteps[tourStepIndex].title}
            </h4>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {defaultTourSteps[tourStepIndex].text}
            </p>
            
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button 
                onClick={handlePrevStep}
                disabled={tourStepIndex === 0}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
              >
                Back
              </button>
              
              <button 
                onClick={handleNextStep}
                className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-lg text-xs hover:from-blue-600 hover:to-indigo-700 transition-all"
              >
                {tourStepIndex === defaultTourSteps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
