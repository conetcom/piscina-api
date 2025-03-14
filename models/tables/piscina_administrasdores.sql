-- Table: public.piscinas_administradores

-- DROP TABLE IF EXISTS public.piscinas_administradores;

CREATE TABLE IF NOT EXISTS public.piscinas_administradores
(
    piscina_id integer NOT NULL,
    administrador_id integer NOT NULL,
    CONSTRAINT piscinas_administradores_pkey PRIMARY KEY (piscina_id, administrador_id),
    CONSTRAINT piscinas_administradores_administrador_id_fkey FOREIGN KEY (administrador_id)
        REFERENCES public.usuarios (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT piscinas_administradores_piscina_id_fkey FOREIGN KEY (piscina_id)
        REFERENCES public.piscinas (piscina_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.piscinas_administradores
    OWNER to wilmerm;