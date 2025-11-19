export enum Sender {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM'
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  isThinking?: boolean; // For the "BS detection" or processing state
  isAnalysis?: boolean; // Special highlighting for cognitive distortion analysis
}

export interface AppState {
  hasStarted: boolean;
  userName: string;
  careerContext: string;
}

export enum AnalysisType {
  COGNITIVE_DISTORTION = 'COGNITIVE_DISTORTION',
  STRATEGY = 'STRATEGY',
  PHILOSOPHY = 'PHILOSOPHY'
}
