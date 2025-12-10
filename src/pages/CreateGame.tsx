import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CreateGameProps {
  onBack: () => void;
  onCreate: (name: string, rules: string, participants: string[], emoji: string) => void;
}

export default function CreateGame({ onBack, onCreate }: CreateGameProps) {
  const [name, setName] = useState('');
  const [rules, setRules] = useState('');
  const [participantsText, setParticipantsText] = useState('');
  const [emoji, setEmoji] = useState('🎁');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const participants = participantsText
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    if (participants.length < 2) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо минимум 2 участника',
        variant: 'destructive',
      });
      return;
    }

    onCreate(name, rules, participants, emoji);
    toast({
      title: 'Игра создана! 🎉',
      description: `Игра "${name}" успешно создана с ${participants.length} участниками`,
    });
  };

  const emojis = ['🎁', '🎄', '⛄', '🎅', '🔔', '⭐', '❄️', '🎀'];

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

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="mb-6 glass-effect border-primary/50 hover:border-primary animate-fade-in"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>

        <Card className="glass-effect border-primary/30 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-4xl font-heading font-bold">
              <span className="text-primary neon-text">Создание</span>{' '}
              <span className="text-secondary neon-text">игры</span> 🎮
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-semibold text-foreground">
                  Название игры
                </Label>
                <Input
                  id="name"
                  placeholder="Новогодний Тайный Санта 2024"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-effect border-primary/30 focus:border-primary text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-lg font-semibold text-foreground">
                  Выберите эмодзи
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {emojis.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`text-4xl p-3 rounded-lg transition-all ${
                        emoji === e 
                          ? 'bg-primary/20 scale-110 neon-glow' 
                          : 'hover:bg-primary/10 hover:scale-105'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rules" className="text-lg font-semibold text-foreground">
                  Условия игры
                </Label>
                <Textarea
                  id="rules"
                  placeholder="Например: Бюджет до 1000 рублей, дарим подарки до 31 декабря..."
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  className="glass-effect border-primary/30 focus:border-primary min-h-[120px] text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants" className="text-lg font-semibold text-foreground">
                  Участники (каждый с новой строки)
                </Label>
                <Textarea
                  id="participants"
                  placeholder="Иван Петров&#10;Мария Сидорова&#10;Алексей Козлов&#10;..."
                  value={participantsText}
                  onChange={(e) => setParticipantsText(e.target.value)}
                  className="glass-effect border-primary/30 focus:border-primary min-h-[200px] text-lg font-mono"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Минимум 2 участника
                </p>
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-bold text-xl py-6 neon-glow animate-pulse-glow"
              >
                <Icon name="Sparkles" size={24} className="mr-2" />
                Создать игру
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
