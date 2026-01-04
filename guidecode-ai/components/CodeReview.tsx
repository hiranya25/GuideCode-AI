
import React, { useState } from 'react';
import { getCodeReviewFromAI } from '../services/aiService';
import { Language } from '../types';

const CodeReview: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('JavaScript');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);

  const handleReview = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    try {
      const result = await getCodeReviewFromAI({ code, language });
      setFeedback(result);
    } catch (e) {
      alert("Something went wrong with the review. Check your API key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Code Reviewer</h2>
        <p className="text-slate-500">Paste your attempt and we'll tell you how to improve it.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
             <div className="p-4 border-b border-slate-100 bg-slate-50">
               <select 
                 value={language}
                 onChange={(e) => setLanguage(e.target.value as Language)}
                 className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none"
               >
                 <option>JavaScript</option>
                 <option>Python</option>
                 <option>Java</option>
                 <option>C++</option>
               </select>
             </div>
             <textarea
               value={code}
               onChange={(e) => setCode(e.target.value)}
               placeholder="// Paste your code here..."
               className="w-full h-[400px] p-6 font-mono text-sm bg-slate-900 text-slate-300 resize-none outline-none"
             />
             <div className="p-4 bg-white border-t border-slate-100 text-right">
               <button 
                 onClick={handleReview}
                 disabled={isLoading || !code.trim()}
                 className={`px-8 py-3 rounded-xl font-bold transition-all ${
                   isLoading ? 'bg-slate-100 text-slate-400' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                 }`}
               >
                 {isLoading ? 'Reviewing...' : 'Get Feedback'}
               </button>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {feedback ? (
            <div className="space-y-6 animate-fade-in">
              <ReviewCard title="Logical Issues" icon="🚩" content={feedback.logicalIssues} />
              <ReviewCard title="Efficiency" icon="🚀" content={feedback.efficiencyConcerns} />
              <ReviewCard title="Improvements" icon="✨" content={feedback.improvementSuggestions} />
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
               <div className="text-5xl mb-4">🔍</div>
               <p className="font-medium">Submit your code to see feedback</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReviewCard = ({ title, icon, content }: { title: string, icon: string, content: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-2 mb-3">
      <span>{icon}</span>
      <h4 className="font-bold text-slate-900">{title}</h4>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed">{content}</p>
  </div>
);

export default CodeReview;
