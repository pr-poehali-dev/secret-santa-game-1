import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import CreateGame from "./pages/CreateGame";
import GameDetail from "./pages/GameDetail";
import Participant from "./pages/Participant";
import { Game } from "./types/game";

const queryClient = new QueryClient();

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [currentView, setCurrentView] = useState<'admin' | 'create' | 'detail'>('admin');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  const handleLogin = (email: string, password: string) => {
    if (email === 'skzry@mail.ru' && password === 'R.ofical.1') {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('admin');
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleCreateGame = (name: string, rules: string, participantNames: string[], emoji: string) => {
    const gameId = crypto.randomUUID();
    const participants = participantNames.map(name => ({
      id: crypto.randomUUID(),
      name,
    }));

    const shuffled = shuffleArray([...participants]);
    participants.forEach((participant, index) => {
      participant.receiverId = shuffled[(index + 1) % shuffled.length].id;
    });

    const newGame: Game = {
      id: gameId,
      name,
      rules,
      emoji,
      participants,
      createdAt: new Date(),
    };

    setGames([...games, newGame]);
    setSelectedGameId(gameId);
    setCurrentView('detail');
  };

  const handleDeleteGame = (id: string) => {
    setGames(games.filter(g => g.id !== id));
  };

  const handleEditGame = (id: string) => {
    setSelectedGameId(id);
    setCurrentView('detail');
  };

  const selectedGame = games.find(g => g.id === selectedGameId);

  function ParticipantRoute() {
    const { gameId, participantId } = useParams();
    const game = games.find(g => g.id === gameId);
    const participant = game?.participants.find(p => p.id === participantId);
    const receiver = game?.participants.find(p => p.id === participant?.receiverId);

    return <Participant game={game || null} participant={participant || null} receiver={receiver || null} />;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          !isLoggedIn ? (
            <Login onLogin={handleLogin} />
          ) : currentView === 'admin' ? (
            <Admin 
              games={games}
              onLogout={handleLogout}
              onCreateGame={() => setCurrentView('create')}
              onEditGame={handleEditGame}
              onDeleteGame={handleDeleteGame}
            />
          ) : currentView === 'create' ? (
            <CreateGame 
              onBack={() => setCurrentView('admin')}
              onCreate={handleCreateGame}
            />
          ) : currentView === 'detail' && selectedGame ? (
            <GameDetail 
              game={selectedGame}
              onBack={() => setCurrentView('admin')}
            />
          ) : (
            <NotFound />
          )
        } 
      />
      <Route path="/participant/:gameId/:participantId" element={<ParticipantRoute />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
