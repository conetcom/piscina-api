CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    author_id INT REFERENCES users(id), -- Clave foránea a la tabla de usuarios
    text TEXT NOT NULL,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
