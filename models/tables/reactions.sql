CREATE TABLE reactions (
    reaction_id SERIAL PRIMARY KEY,          -- Identificador único de la reacción
    post_id INT REFERENCES posts(post_id)    -- Relación con la tabla de posts
             ON DELETE CASCADE,              -- Si se elimina el post, también las reacciones
    user_id INT REFERENCES usuarios(user_id) -- Relación con la tabla de usuarios
             ON DELETE CASCADE,              -- Si el usuario se elimina, también sus reacciones
    reaction_type VARCHAR(50) NOT NULL,      -- Tipo de reacción (e.g., 'like', 'love', 'angry', etc.)
    created_at TIMESTAMP DEFAULT NOW()       -- Fecha y hora en que se hizo la reacción
);
