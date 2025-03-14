-- Table: public.clientes

-- DROP TABLE IF EXISTS public.clientes;

CREATE TABLE IF NOT EXISTS public.clientes
(
    cliente_id integer NOT NULL DEFAULT nextval('clientes_id_seq'::regclass),
    nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    telefono character varying(20) COLLATE pg_catalog."default",
    direccion text COLLATE pg_catalog."default",
    nit character varying(20) COLLATE pg_catalog."default",
    CONSTRAINT clientes_pkey PRIMARY KEY (cliente_id),
    CONSTRAINT clientes_email_key UNIQUE (email)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.clientes
    OWNER to wilmerm;