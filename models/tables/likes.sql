CREATE TABLE likes (
    like_id SERIAL PRIMARY KEY,              -- Identificador único del like
    post_id INT REFERENCES posts(post_id)    -- Relación con la tabla de posts
             ON DELETE CASCADE,              -- Si se elimina el post, se eliminan los likes
    user_id INT REFERENCES usuarios(user_id) -- Relación con la tabla de usuarios (quién dio el like)
             ON DELETE CASCADE,              -- Si el usuario se elimina, también se eliminan los likes
    created_at TIMESTAMP DEFAULT NOW()       -- Fecha y hora en que se dio el like
);
