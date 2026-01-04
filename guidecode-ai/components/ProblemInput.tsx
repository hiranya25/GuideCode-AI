
import React, { useState } from 'react';
import { Language, Difficulty, HelpLevel, ProblemInput as ProblemInputType } from '../types';

interface Props {
  onSubmit: (data: ProblemInputType) => void;
  isLoading: boolean;
}

const ProblemInput: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [problem, setProblem] = useState('');
  const [language, setLanguage] = useState<Language>('General Logic');
  const [difficulty, setDifficulty] = useState<Difficulty>('Beginner');
  const [helpLevel, setHelpLevel] = useState<HelpLevel>('Guided Steps');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;
    onSubmit({ problem, language, difficulty, helpLevel });
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-12 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-2xl font-extrabold text-slate-900">What's the challenge?</h2>
          <p className="text-slate-500 mt-1">Paste your coding problem below and we'll help you solve it logically.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">Problem Statement</label>
            <textarea
              required
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="e.g. Write a function to check if a string is a palindrome..."
              className="w-full h-48 p-4 rounded-2xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none outline-none text-slate-800"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>Java</option>
                <option>Python</option>
                <option>C++</option>
                <option>JavaScript</option>
                <option>General Logic</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Difficulty</label>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3">Help Level</label>
              <select 
                value={helpLevel}
                onChange={(e) => setHelpLevel(e.target.value as HelpLevel)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>Light Hint</option>
                <option>Guided Steps</option>
                <option>Deep Explanation</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !problem.trim()}
            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
              isLoading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin"></div>
                Analyzing Problem...
              </>
            ) : (
              'Guide Me'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProblemInput;
