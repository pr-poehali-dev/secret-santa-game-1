import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { Game, Participant as ParticipantType } from '@/types/game';

interface ParticipantProps {
  game: Game | null;
  participant: ParticipantType | null;
  receiver: ParticipantType | null;
}

export default function Participant({ game, participant, receiver }: ParticipantProps) {
  const [agreed, setAgreed] = useState(false);
  const [revealed, setRevealed] = useState(false);

  if (!game || !participant) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
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
        <Card className="glass-effect border-destructive/30 relative z-10 animate-scale-in">
          <CardContent className="pt-12 pb-12 text-center">
            <Icon name="AlertCircle" size={64} className="text-destructive mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">Игра не найдена</h2>
            <p className="text-muted-foreground">Проверьте правильность ссылки</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleReveal = () => {
    if (agreed) {
      setRevealed(true);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
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

      <Card className="w-full max-w-2xl glass-effect border-primary/30 relative z-10 animate-scale-in">
        <CardHeader className="text-center">
          <div className="mb-4 animate-float">
            <span className="text-8xl">{game.emoji || '🎁'}</span>
          </div>
          <CardTitle className="text-4xl font-heading font-bold mb-4">
            <span className="text-primary neon-text">{game.name}</span>
          </CardTitle>
          <p className="text-2xl text-foreground font-semibold">
            Привет, <span className="text-secondary">{participant.name}</span>! 👋
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!revealed ? (
            <>
              <div className="bg-card/50 rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold text-secondary">Условия игры:</h3>
                <p className="text-foreground/80 text-lg whitespace-pre-wrap">{game.rules}</p>
              </div>

              <div className="flex items-start space-x-3 bg-accent/10 rounded-lg p-4">
                <Checkbox 
                  id="agree" 
                  checked={agreed}
                  onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  className="mt-1"
                />
                <label
                  htmlFor="agree"
                  className="text-foreground text-lg leading-relaxed cursor-pointer"
                >
                  Я прочитал(а) условия и готов(а) участвовать в игре Тайный Санта
                </label>
              </div>

              <Button 
                onClick={handleReveal}
                disabled={!agreed}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 disabled:opacity-50 text-white font-bold text-xl py-8 neon-glow"
              >
                <Icon name="Gift" size={24} className="mr-2" />
                Узнать, кому я дарю подарок
              </Button>
            </>
          ) : (
            <div className="text-center space-y-6 animate-fade-in">
              <div className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg p-8 border-2 border-primary/50 neon-glow">
                <p className="text-xl text-muted-foreground mb-4">Ты даришь подарок для:</p>
                <div className="animate-float">
                  <p className="text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary neon-text mb-2">
                    {receiver?.name || 'Загадка...'}
                  </p>
                </div>
                <p className="text-lg text-muted-foreground mt-4">🎁 Удачи в выборе подарка! 🎁</p>
              </div>

              <div className="bg-accent/10 rounded-lg p-6">
                <Icon name="Lock" size={32} className="text-accent mx-auto mb-3" />
                <p className="text-foreground/80 text-base">
                  Это секрет! Никому не рассказывай, кому ты даришь подарок. 
                  Это сделает игру еще интереснее! 🤫
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
