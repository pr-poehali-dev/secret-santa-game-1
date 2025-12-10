import { useState, useEffect } from 'react';
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
import { api } from "./lib/api";
import { useToast } from "./hooks/use-toast";

const queryClient = new QueryClient();

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [currentView, setCurrentView] = useState<'admin' | 'create' | 'detail'>('admin');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      loadGames();
    }
  }, [isLoggedIn]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const fetchedGames = await api.getAllGames();
      setGames(fetchedGames.map(g => ({
        ...g,
        createdAt: new Date(g.createdAt)
      })));
    } catch (error) {
      console.error('Failed to load games:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить игры',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleCreateGame = async (name: string, rules: string, participantNames: string[], emoji: string) => {
    try {
      const gameId = crypto.randomUUID();
      const participants = participantNames.map(name => ({
        id: crypto.randomUUID(),
        name,
      }));

      const shuffled = shuffleArray([...participants]);
      participants.forEach((participant, index) => {
        participant.receiverId = shuffled[(index + 1) % shuffled.length].id;
      });

      const newGame = {
        id: gameId,
        name,
        rules,
        emoji,
        participants,
        createdAt: new Date().toISOString(),
      };

      await api.createGame(newGame);
      await loadGames();
      
      setSelectedGameId(gameId);
      setCurrentView('detail');
    } catch (error) {
      console.error('Failed to create game:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать игру',
        variant: 'destructive',
      });
    }
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
    const [participantData, setParticipantData] = useState<{
      game: Game | null;
      participant: any;
      receiver: any;
    }>({ game: null, participant: null, receiver: null });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const loadData = async () => {
        if (!gameId || !participantId) return;
        
        try {
          const data = await api.getParticipantData(gameId, participantId);
          setParticipantData({
            game: { ...data.game, createdAt: new Date(data.game.createdAt) },
            participant: data.participant,
            receiver: data.receiver,
          });
        } catch (error) {
          console.error('Failed to load participant data:', error);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, [gameId, participantId]);

    if (loading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-2xl text-primary">Загрузка...</div>
        </div>
      );
    }

    return (
      <Participant 
        game={participantData.game} 
        participant={participantData.participant} 
        receiver={participantData.receiver} 
      />
    );
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
