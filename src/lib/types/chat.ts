export interface ChatQuestion {
  text: string;
}

export interface ChatCategory {
  id: string;
  title: string;
  color: string;
  icon: string;
  questions: ChatQuestion[];
}

export interface ChatData {
  version: string;
  createdAt: string;
  updatedAt: string;
  categoriesData: ChatCategory[];
} 