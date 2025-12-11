const API_URL = 'https://functions.poehali.dev/36ccffb6-6bc7-428a-9a91-f5e0660d7f07';

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
  createdAt: string;
}

export interface ParticipantData {
  game: Game;
  participant: Participant | null;
  receiver: Participant | null;
}

export const api = {
  async getAllGames(): Promise<Game[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch games');
    return response.json();
  },

  async getGame(gameId: string): Promise<Game> {
    const response = await fetch(`${API_URL}?path=/games/${gameId}`);
    if (!response.ok) throw new Error('Failed to fetch game');
    return response.json();
  },

  async createGame(game: Game): Promise<{ id: string; message: string }> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(game),
    });
    if (!response.ok) throw new Error('Failed to create game');
    return response.json();
  },

  async getParticipantData(gameId: string, participantId: string): Promise<ParticipantData> {
    const response = await fetch(`${API_URL}?path=/participant/${gameId}/${participantId}`);
    if (!response.ok) throw new Error('Failed to fetch participant data');
    return response.json();
  },

  async deleteGame(gameId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}?path=/games/${gameId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete game');
    return response.json();
  },
};