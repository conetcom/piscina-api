-- Table: public.estado_piscinas

-- DROP TABLE IF EXISTS public.estado_piscinas;

CREATE TABLE IF NOT EXISTS public.estado_piscinas
(
    state_id integer NOT NULL DEFAULT nextval('estado_piscinas_id_seq'::regclass),
    piscina_id integer NOT NULL,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ph numeric(4,2) NOT NULL,
    orp numeric(5,2) NOT NULL,
    st_bombas boolean NOT NULL,
    st_light boolean NOT NULL,
    CONSTRAINT estado_piscinas_pkey PRIMARY KEY (state_id),
    CONSTRAINT estado_piscinas_piscina_id_fkey FOREIGN KEY (piscina_id)
        REFERENCES public.piscinas (piscina_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.estado_piscinas
    OWNER to wilmerm;