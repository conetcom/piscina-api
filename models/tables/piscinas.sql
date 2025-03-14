-- Table: public.piscinas

-- DROP TABLE IF EXISTS public.piscinas;

CREATE TABLE IF NOT EXISTS public.piscinas
(
    piscina_id integer NOT NULL DEFAULT nextval('piscinas_id_seq'::regclass),
    nombre character varying(255) COLLATE pg_catalog."default" NOT NULL,
    cliente_id integer NOT NULL,
    ubicacion text COLLATE pg_catalog."default",
    CONSTRAINT piscinas_pkey PRIMARY KEY (piscina_id),
    CONSTRAINT piscinas_cliente_id_fkey FOREIGN KEY (cliente_id)
        REFERENCES public.clientes (cliente_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.piscinas
    OWNER to wilmerm;