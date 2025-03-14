-- Table: public.usuarios

-- DROP TABLE IF EXISTS public.usuarios;

CREATE TABLE IF NOT EXISTS public.usuarios
(
    user_id integer NOT NULL DEFAULT nextval('administradores_id_seq'::regclass),
    username character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    password character varying(255) COLLATE pg_catalog."default" NOT NULL,
    lastname character varying COLLATE pg_catalog."default",
    userbio character varying COLLATE pg_catalog."default",
    rol user_role DEFAULT 'user'::user_role,
    CONSTRAINT administradores_pkey PRIMARY KEY (user_id),
    CONSTRAINT administradores_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.usuarios
    OWNER to wilmerm;