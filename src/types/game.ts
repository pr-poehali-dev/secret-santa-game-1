export interface Participant {
  id: string;
  name: string;
  receiverId?: string;
}

export interface Game {
  id: string;
  name: string;
  rules: string;
  emoji: string;
  participants: Participant[];
  createdAt: Date;
}
