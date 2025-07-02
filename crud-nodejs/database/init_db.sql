# Gestisce la configurazione e la connessione al database MySQL

CREATE TABLE IF NOT EXISTS type_materiali (
    type_mat_id                   TINYINT AUTO_INCREMENT,
    type_mat_name                 VARCHAR(50) NOT NULL,

    PRIMARY KEY (type_mat_id)
);

CREATE TABLE IF NOT EXISTS materiali (
  materiale_id                    SMALLINT        AUTO_INCREMENT,
  materiale_name                  VARCHAR(255)    NOT NULL,
  materiale_descr                 TEXT,
  materiale_costo_unit            DECIMAL (10,2)  NOT NULL DEFAULT 0,
  materiale_prezzo_unit           DECIMAL (10,2)  NOT NULL,
  materiale_quantity              SMALLINT        DEFAULT 0,
  materiale_type_fk               TINYINT         NOT NULL,

  PRIMARY KEY (materiale_id),
  FOREIGN KEY (materiale_type_fk) REFERENCES type_materiali (type_mat_id)
);

CREATE TABLE IF NOT EXISTS usura_materiali (
  usura_mat_id                    SMALLINT        AUTO_INCREMENT,
  materiale_id_fk                 SMALLINT,
  usura_mat_name                  VARCHAR(255),
  usura_mat_percentuale_usura     DECIMAL (5,2)   DEFAULT 0.00,
  usura_mat_vita_restante         VARCHAR(255),

  PRIMARY KEY (usura_mat_id),
  -- Chiave esterna per collegarsi alla tabella materiali
  FOREIGN KEY (materiale_id_fk) REFERENCES materiali (materiale_id)
);

CREATE TABLE IF NOT EXISTS trasporto (
  trasporto_id                    TINYINT AUTO_INCREMENT,
  trasporto_name                  VARCHAR(255),
  trasporto_distanza_km           INT NOT NULL,
  trasporto_costo                 DECIMAL (10,2) NOT NULL,

  PRIMARY KEY (trasporto_id)
);

CREATE TABLE IF NOT EXISTS sconti (
    sconto_id TINYINT AUTO_INCREMENT,
    sconto_name VARCHAR(255),
    sconto_percentuale DECIMAL(5, 2) DEFAULT 0.00,
    PRIMARY KEY (sconto_id)
);

CREATE TABLE IF NOT EXISTS preventivi (
  preventivo_id                   SMALLINT AUTO_INCREMENT,
  preventivo_name                 VARCHAR(255),
  preventivo_descr                TEXT,
  preventivo_data_creazione       DATETIME DEFAULT CURRENT_TIMESTAMP,
  preventivo_data_evento          DATE,
  preventivo_costo_totale         DECIMAL (10,2) NOT NULL,
  preventivo_sconto_id_fk         TINYINT,
  preventivo_trasporto_id_fk      TINYINT,

  PRIMARY KEY (preventivo_id),
  FOREIGN KEY (preventivo_sconto_id_fk) REFERENCES sconti (sconto_id),
  FOREIGN KEY (preventivo_trasporto_id_fk) REFERENCES trasporto (trasporto_id)
);

CREATE TABLE IF NOT EXISTS preventivi_materiali (
    id SMALLINT AUTO_INCREMENT,
    preventivo_mat_id SMALLINT NOT NULL,
    preventivo_mat_mat_id SMALLINT NOT NULL,
    preventivo_mat_quantita SMALLINT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY unique_preventivo_materiale (preventivo_mat_id, preventivo_mat_mat_id),
    -- Riferimento alla tabella preventivi
    FOREIGN KEY (preventivo_mat_id) REFERENCES preventivi (preventivo_id),
    -- Riferimento alla tabella materiali
    FOREIGN KEY (preventivo_mat_mat_id) REFERENCES materiali (materiale_id)
);
