import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onComplete: (context: string) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: ''
  });

  const questions = [
    "In one sentence, why do you feel you are 'behind'?",
    "Who exactly are you comparing yourself to? (Be specific)",
    "What is the single biggest thing stopping you right now?"
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      const context = `
        User Context:
        1. Feels behind because: ${answers.q1}
        2. Comparing to: ${answers.q2}
        3. Obstacle: ${answers.q3}
      `;
      onComplete(context);
    }
  };

  const handleChange = (val: string) => {
    if (step === 0) setAnswers({...answers, q1: val});
    if (step === 1) setAnswers({...answers, q2: val});
    if (step === 2) setAnswers({...answers, q3: val});
  };

  const currentAnswer = step === 0 ? answers.q1 : step === 1 ? answers.q2 : answers.q3;

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 tracking-tighter text-white">
        The Mirror
      </h1>
      
      <div className="w-full bg-charcoal border border-gray-800 p-8 rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 h-1 bg-indigo-600 transition-all duration-500 ease-out" style={{ width: `${((step + 1) / 3) * 100}%` }}></div>
        
        <h2 className="text-xl font-mono text-gray-400 mb-6">
            Question {step + 1}/3
        </h2>
        
        <p className="text-2xl text-white font-medium mb-8">
            {questions[step]}
        </p>

        <input 
            type="text" 
            autoFocus
            value={currentAnswer}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && currentAnswer.trim() && handleNext()}
            className="w-full bg-obsidian text-white p-4 rounded-lg border border-gray-700 focus:border-indigo-500 outline-none mb-6 transition-colors placeholder-gray-700"
            placeholder="Type your answer..."
        />

        <button 
            onClick={handleNext}
            disabled={!currentAnswer.trim()}
            className="flex items-center justify-center w-full py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
            {step === 2 ? 'Face Reality' : 'Next'} <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
      
      <p className="mt-8 text-sm text-gray-600 max-w-md">
        WARNING: This is not a support group. This is a psychological dissection of your career anxieties designed to prompt immediate action.
      </p>
    </div>
  );
};
