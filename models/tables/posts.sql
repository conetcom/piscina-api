CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,               -- Identificador único del post
    user_id INT REFERENCES usuarios(user_id)  -- Relación con la tabla de usuarios
              ON DELETE CASCADE,              -- Si el usuario se elimina, también se eliminan sus posts
    title VARCHAR(255) NOT NULL,              -- Título del post
    content TEXT NOT NULL,                    -- Contenido del post
    image_url VARCHAR(255),                   -- (Opcional) URL de la imagen relacionada con el post
    created_at TIMESTAMP DEFAULT NOW(),       -- Fecha de creación del post
    updated_at TIMESTAMP DEFAULT NOW(),       -- Fecha de última actualización
    status VARCHAR(50) DEFAULT 'active'       -- Estado del post (e.g., 'active', 'draft', 'deleted')
);
