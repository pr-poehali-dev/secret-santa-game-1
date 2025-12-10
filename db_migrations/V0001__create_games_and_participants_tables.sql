CREATE TABLE IF NOT EXISTS t_p50414235_secret_santa_game_1.games (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    rules TEXT NOT NULL,
    emoji TEXT NOT NULL DEFAULT '🎁',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p50414235_secret_santa_game_1.participants (
    id UUID PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES t_p50414235_secret_santa_game_1.games(id),
    name TEXT NOT NULL,
    receiver_id UUID
);

CREATE INDEX idx_participants_game_id ON t_p50414235_secret_santa_game_1.participants(game_id);
CREATE INDEX idx_participants_receiver_id ON t_p50414235_secret_santa_game_1.participants(receiver_id);