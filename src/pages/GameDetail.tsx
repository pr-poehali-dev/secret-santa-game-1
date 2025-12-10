import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Game } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

interface GameDetailProps {
  game: Game;
  onBack: () => void;
}

export default function GameDetail({ game, onBack }: GameDetailProps) {
  const { toast } = useToast();
  const baseUrl = window.location.origin;

  const copyLink = (participantId: string, participantName: string) => {
    const link = `${baseUrl}/participant/${game.id}/${participantId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Ссылка скопирована! 📋',
      description: `Ссылка для ${participantName} скопирована в буфер обмена`,
    });
  };

  const copyAllLinks = () => {
    const allLinks = game.participants
      .map((p) => `${p.name}: ${baseUrl}/participant/${game.id}/${p.id}`)
      .join('\n');
    navigator.clipboard.writeText(allLinks);
    toast({
      title: 'Все ссылки скопированы! 📋',
      description: `Скопировано ${game.participants.length} ссылок`,
    });
  };

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

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        <Button 
          onClick={onBack}
          variant="outline" 
          className="mb-6 glass-effect border-primary/50 hover:border-primary animate-fade-in"
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          К списку игр
        </Button>

        <Card className="glass-effect border-primary/30 mb-6 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-4xl font-heading font-bold flex items-center justify-between">
              <div>
                <span className="text-primary neon-text">{game.name}</span>
              </div>
              <span className="text-6xl animate-float">{game.emoji || '🎁'}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Условия игры:</h3>
              <p className="text-foreground/80 text-lg whitespace-pre-wrap">{game.rules}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Участников: {game.participants.length}</h3>
            </div>
            <Button 
              onClick={copyAllLinks}
              variant="outline"
              className="w-full border-accent/50 hover:border-accent hover:bg-accent/10"
            >
              <Icon name="Copy" size={20} className="mr-2" />
              Скопировать все ссылки
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-3xl font-heading font-bold text-primary neon-text mb-4">
            Участники и их ссылки
          </h2>
          {game.participants.map((participant, index) => (
            <Card 
              key={participant.id}
              className="glass-effect border-secondary/30 hover:border-secondary/60 transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">{participant.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono break-all">
                      {baseUrl}/participant/{game.id}/{participant.id}
                    </p>
                    {participant.receiverId && (
                      <p className="text-sm text-accent mt-2">
                        → Дарит подарок: {game.participants.find(p => p.id === participant.receiverId)?.name}
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => copyLink(participant.id, participant.name)}
                    variant="outline"
                    size="sm"
                    className="ml-4 border-primary/50 hover:border-primary"
                  >
                    <Icon name="Copy" size={16} className="mr-2" />
                    Копировать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
