CREATE TABLE images (
       id           TEXT NOT NULL PRIMARY KEY,
       uploaded     TEXT NOT NULL DEFAULT(CURRENT_TIMESTAMP),
       title        TEXT NOT NULL,
       description  TEXT
);
