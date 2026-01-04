
export type Role = 'user' | 'assistant';

export interface User {
  uid: string; // Firebase Unique ID
  name: string;
  email: string;
  avatarColor: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
}

export type Language = 'Java' | 'Python' | 'C++' | 'JavaScript' | 'General Logic';
export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type HelpLevel = 'Light Hint' | 'Guided Steps' | 'Deep Explanation';

export interface ProblemInput {
  problem: string;
  language: Language;
  difficulty: Difficulty;
  helpLevel: HelpLevel;
}

export interface AIResponse {
  problemUnderstanding: string;
  approach: string;
  hints: string[];
  edgeCases: string;
  complexity: string;
}

export interface CodeReviewInput {
  code: string;
  language: Language;
}
