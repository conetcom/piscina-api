CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,          -- Identificador único del comentario
    post_id INT REFERENCES posts(post_id)   -- Relación con la tabla de posts
             ON DELETE CASCADE,             -- Si se elimina el post, también se eliminan los comentarios
    user_id INT REFERENCES usuarios(user_id)-- Relación con la tabla de usuarios (quién hizo el comentario)
             ON DELETE CASCADE,             -- Si el usuario se elimina, también sus comentarios
    content TEXT NOT NULL,                  -- Contenido del comentario
    created_at TIMESTAMP DEFAULT NOW(),     -- Fecha de creación del comentario
    updated_at TIMESTAMP DEFAULT NOW()      -- Fecha de última actualización del comentario
);
