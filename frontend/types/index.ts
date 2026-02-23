export interface Citation {
  case_name: string;
  court: string;
  date: string;
  citation: string;
  url?: string;
  excerpt: string;
}

export interface RetrievedChunk {
  text: string;
  metadata: Record<string, any>;
}

export interface ChatRequest {
  session_id: string;
  message: string;
  conversation_history?: ConversationMessage[];
}

export interface ChatResponse {
  answer: string;
  confidence: 'high' | 'medium' | 'low' | 'insufficient';
  confidence_score: number;
  citations: Citation[];
  retrieved_chunks: RetrievedChunk[];
  disclaimer: string;
  error?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  confidence?: string;
  retrieved_chunks?: RetrievedChunk[];
  timestamp: Date;
}
