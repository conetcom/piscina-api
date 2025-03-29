CREATE TABLE user_socials (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES usuarios(user_id) ON DELETE CASCADE,
    platform VARCHAR(50), -- Nombre de la red social (facebook, twitter, etc.)
    url VARCHAR(255) NOT NULL
);
