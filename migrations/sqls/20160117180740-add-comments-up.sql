CREATE TABLE comments (
       id             INTEGER   NOT NULL PRIMARY KEY,
       image_id       TEXT      NOT NULL,
       date           TEXT      NOT NULL DEFAULT(CURRENT_TIMESTAMP),
       username       TEXT      NOT NULL,
       comment        TEXT      NOT NULL,
       FOREIGN KEY(image_id) REFERENCES images(id) ON DELETE CASCADE
);
