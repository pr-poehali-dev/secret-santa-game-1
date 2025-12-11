import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Game, Participant } from '@/types/game';
import { useToast } from '@/hooks/use-toast';

interface GameDetailProps {
  game: Game;
  onBack: () => void;
  onUpdate: (updatedGame: Game) => void;
}

export default function GameDetail({ game, onBack, onUpdate }: GameDetailProps) {
  const { toast } = useToast();
  const baseUrl = window.location.origin;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(game.name);
  const [editedRules, setEditedRules] = useState(game.rules);
  const [editedEmoji, setEditedEmoji] = useState(game.emoji || '🎁');
  const [participants, setParticipants] = useState<Participant[]>(game.participants);
  const [newParticipantName, setNewParticipantName] = useState('');

  const copyLink = (participantId: string, participantName: string) => {
    const link = `${baseUrl}/participant/${game.id}/${participantId}`;
    navigator.clipboard.writeText(link);
    toast({
      title: 'Ссылка скопирована! 📋',
      description: `Ссылка для ${participantName} скопирована в буфер обмена`,
    });
  };

  const copyAllLinks = () => {
    const allLinks = participants
      .map((p) => `${p.name}: ${baseUrl}/participant/${game.id}/${p.id}`)
      .join('\n');
    navigator.clipboard.writeText(allLinks);
    toast({
      title: 'Все ссылки скопированы! 📋',
      description: `Скопировано ${participants.length} ссылок`,
    });
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const reshuffleParticipants = () => {
    if (participants.length < 2) {
      toast({
        title: 'Недостаточно участников',
        description: 'Для жеребьёвки нужно минимум 2 участника',
        variant: 'destructive',
      });
      return;
    }

    const shuffled = shuffleArray([...participants]);
    const updatedParticipants = participants.map((participant, index) => ({
      ...participant,
      receiverId: shuffled[(index + 1) % shuffled.length].id,
    }));
    
    setParticipants(updatedParticipants);
    toast({
      title: 'Жеребьёвка проведена! 🎲',
      description: 'Участники перераспределены',
    });
  };

  const addParticipant = () => {
    if (!newParticipantName.trim()) return;
    
    const newParticipant: Participant = {
      id: crypto.randomUUID(),
      name: newParticipantName.trim(),
    };
    
    setParticipants([...participants, newParticipant]);
    setNewParticipantName('');
    toast({
      title: 'Участник добавлен',
      description: `${newParticipant.name} добавлен в игру`,
    });
  };

  const removeParticipant = (id: string) => {
    const participantToRemove = participants.find(p => p.id === id);
    setParticipants(participants.filter(p => p.id !== id));
    toast({
      title: 'Участник удалён',
      description: `${participantToRemove?.name} удалён из игры`,
    });
  };

  const saveChanges = () => {
    const updatedGame: Game = {
      ...game,
      name: editedName,
      rules: editedRules,
      emoji: editedEmoji,
      participants,
    };
    
    onUpdate(updatedGame);
    setIsEditing(false);
    toast({
      title: 'Изменения сохранены! ✅',
      description: 'Игра успешно обновлена',
    });
  };

  const cancelEditing = () => {
    setEditedName(game.name);
    setEditedRules(game.rules);
    setEditedEmoji(game.emoji || '🎁');
    setParticipants(game.participants);
    setIsEditing(false);
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
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={onBack}
            variant="outline" 
            className="glass-effect border-primary/50 hover:border-primary animate-fade-in"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            К списку игр
          </Button>

          <div className="flex gap-2">
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="glass-effect border-accent/50 hover:border-accent"
              >
                <Icon name="Pencil" size={20} className="mr-2" />
                Редактировать
              </Button>
            ) : (
              <>
                <Button 
                  onClick={saveChanges}
                  className="bg-accent hover:bg-accent/80"
                >
                  <Icon name="Save" size={20} className="mr-2" />
                  Сохранить
                </Button>
                <Button 
                  onClick={cancelEditing}
                  variant="outline"
                  className="border-destructive/50 hover:border-destructive"
                >
                  <Icon name="X" size={20} className="mr-2" />
                  Отмена
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="glass-effect border-primary/30 mb-6 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-4xl font-heading font-bold flex items-center justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <Input 
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-3xl h-14 bg-background/50"
                      placeholder="Название игры"
                    />
                    <Input 
                      value={editedEmoji}
                      onChange={(e) => setEditedEmoji(e.target.value)}
                      className="text-3xl h-14 bg-background/50 w-24"
                      placeholder="🎁"
                      maxLength={2}
                    />
                  </div>
                ) : (
                  <span className="text-primary neon-text">{game.name}</span>
                )}
              </div>
              {!isEditing && <span className="text-6xl animate-float">{game.emoji || '🎁'}</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Условия игры:</h3>
              {isEditing ? (
                <Textarea 
                  value={editedRules}
                  onChange={(e) => setEditedRules(e.target.value)}
                  className="min-h-[200px] bg-background/50"
                  placeholder="Опишите условия игры..."
                />
              ) : (
                <p className="text-foreground/80 text-lg whitespace-pre-wrap">{game.rules}</p>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Участников: {participants.length}</h3>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={copyAllLinks}
                variant="outline"
                className="flex-1 border-accent/50 hover:border-accent hover:bg-accent/10"
              >
                <Icon name="Copy" size={20} className="mr-2" />
                Скопировать все ссылки
              </Button>
              <Button 
                onClick={reshuffleParticipants}
                variant="outline"
                className="flex-1 border-secondary/50 hover:border-secondary hover:bg-secondary/10"
              >
                <Icon name="Shuffle" size={20} className="mr-2" />
                Перемешать пары
              </Button>
            </div>
          </CardContent>
        </Card>

        {isEditing && (
          <Card className="glass-effect border-accent/30 mb-6 animate-scale-in">
            <CardHeader>
              <CardTitle className="text-2xl font-heading flex items-center text-accent">
                <Icon name="UserPlus" size={24} className="mr-2" />
                Добавить участника
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input 
                  value={newParticipantName}
                  onChange={(e) => setNewParticipantName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                  placeholder="Имя участника"
                  className="bg-background/50"
                />
                <Button 
                  onClick={addParticipant}
                  className="bg-accent hover:bg-accent/80"
                >
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-3xl font-heading font-bold text-primary neon-text mb-4">
            Участники и их ссылки
          </h2>
          {participants.map((participant, index) => (
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
                        → Дарит подарок: {participants.find(p => p.id === participant.receiverId)?.name}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => copyLink(participant.id, participant.name)}
                      variant="outline"
                      size="sm"
                      className="border-primary/50 hover:border-primary"
                    >
                      <Icon name="Copy" size={16} className="mr-2" />
                      Копировать
                    </Button>
                    {isEditing && (
                      <Button
                        onClick={() => removeParticipant(participant.id)}
                        variant="outline"
                        size="sm"
                        className="border-destructive/50 hover:border-destructive hover:bg-destructive/10"
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
