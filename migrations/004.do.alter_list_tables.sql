ALTER TABLE general
  ADD COLUMN
    user_id INTEGER REFERENCES user(id) ON DELETE CASCADE NOT NULL;

ALTER TABLE events
  ADD COLUMN
    user_id INTEGER REFERENCES user(id) ON DELETE CASCADE NOT NULL;