CREATE TABLE message_replies (
    id SERIAL PRIMARY KEY,
    message_id INT REFERENCES messages(id) ON DELETE CASCADE,  -- ID del mensaje original
    user_id INT REFERENCES users(id) ON DELETE CASCADE,        -- ID del usuario que responde
    reply TEXT NOT NULL,                                       -- El texto de la respuesta
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP             -- Fecha de creación de la respuesta
);
