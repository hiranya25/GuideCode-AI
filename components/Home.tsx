
import React from 'react';

const Home: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const scrollToPhilosophy = () => {
    document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
              Learn How to <span className="text-indigo-600">Think</span>, Not What to <span className="text-slate-400">Copy</span>
            </h1>
            <p className="text-xl text-slate-500 mb-10 leading-relaxed">
              An AI coding mentor that guides you step-by-step through complex problems without ever giving away the solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onStart}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95"
              >
                Try a Coding Problem
              </button>
              <button 
                onClick={scrollToPhilosophy}
                className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
              >
                Why GuideCode?
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-400 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-400 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon="🚫"
              title="No Direct Answers"
              description="We withhold code solutions to ensure you actually understand the logic and syntax."
            />
            <FeatureCard 
              icon="🪜"
              title="Step-by-Step"
              description="Breaking down complex algorithms into manageable logical chunks for easier learning."
            />
            <FeatureCard 
              icon="🧠"
              title="Ethical Learning"
              description="Designed to supplement your education, not replace your critical thinking process."
            />
            <FeatureCard 
              icon="🎚️"
              title="Adaptive Help"
              description="Choose between light hints or deep explanations based on your current level."
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section id="philosophy" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">The GuideCode Philosophy</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-2xl">🚧</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">The Coding Crutch Problem</h3>
                <p className="text-slate-600 leading-relaxed">
                  In the age of LLMs, it's too easy to generate code that works without understanding <i>why</i> it works. This creates "Copy-Paste Engineers" who struggle when the AI isn't available or makes a mistake.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-2xl">🏗️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Building Logical Foundations</h3>
                <p className="text-slate-600 leading-relaxed">
                  GuideCode AI acts as a <b>Socratic Mentor</b>. Instead of giving you the bricks, we teach you how to mix the mortar. We focus on algorithm design, edge-case identification, and complexity analysis.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-2xl">🚀</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Your Career Insurance</h3>
                <p className="text-slate-600 leading-relaxed">
                  By mastering problem-solving, you become an engineer who can work across any language or framework. Syntax changes, but logic is eternal. GuideCode helps you master the logic.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 p-8 bg-slate-900 rounded-3xl text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to start thinking?</h3>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join thousands of students who are reclaiming their learning process from "black-box" AI tools.</p>
            <button 
              onClick={onStart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
            >
              Start Your First Problem
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: string, title: string, description: string }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
  </div>
);

export default Home;
