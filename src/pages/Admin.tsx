import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Game } from '@/types/game';

interface AdminProps {
  games: Game[];
  onLogout: () => void;
  onCreateGame: () => void;
  onEditGame: (id: string) => void;
  onDeleteGame: (id: string) => void;
}

export default function Admin({ games, onLogout, onCreateGame, onEditGame, onDeleteGame }: AdminProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-5xl font-heading font-bold mb-2">
              <span className="text-primary neon-text">Админ</span>
              <span className="text-secondary neon-text">-панель</span> 🎅
            </h1>
            <p className="text-muted-foreground text-lg">Управление играми в Тайного Санту</p>
          </div>
          <Button onClick={onLogout} variant="outline" className="glass-effect border-primary/50 hover:border-primary">
            <Icon name="LogOut" size={20} className="mr-2" />
            Выйти
          </Button>
        </div>

        <Button 
          onClick={onCreateGame}
          size="lg"
          className="mb-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-lg px-8 py-6 neon-glow animate-pulse-glow"
        >
          <Icon name="Plus" size={24} className="mr-2" />
          Создать новую игру
        </Button>

        {games.length === 0 ? (
          <Card className="glass-effect border-primary/30 animate-scale-in">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="mb-6 animate-float">
                <Icon name="Gift" size={64} className="text-primary mx-auto" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-2 text-foreground">Пока нет игр</h3>
              <p className="text-muted-foreground mb-6">Создайте первую игру и начните праздничное веселье!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game, index) => (
              <Card 
                key={game.id} 
                className="glass-effect border-primary/30 hover:border-primary/60 transition-all hover:scale-105 cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-heading flex items-center justify-between">
                    <span className="text-primary">{game.name}</span>
                    <span className="text-3xl animate-float">{game.emoji || '🎁'}</span>
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {game.participants.length} участников
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/80 mb-4 line-clamp-2">{game.rules}</p>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => onEditGame(game.id)}
                      variant="outline" 
                      size="sm"
                      className="flex-1 border-secondary/50 hover:border-secondary hover:bg-secondary/10"
                    >
                      <Icon name="Edit" size={16} className="mr-2" />
                      Открыть
                    </Button>
                    <Button 
                      onClick={() => onDeleteGame(game.id)}
                      variant="outline" 
                      size="sm"
                      className="border-destructive/50 hover:border-destructive hover:bg-destructive/10"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
