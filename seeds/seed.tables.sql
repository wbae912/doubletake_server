BEGIN;

TRUNCATE
  general,
  events,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (email, username, password)
VALUES
  ('test@test.com', 'user1', '$2a$12$4dY7PW6aQRtt50x7dArb0uBfvps.vkeds4WiWxGtW.b23UvpE9hQ2'), -- Password = Admin123!
  ('test1@test.com', 'user2', '$2a$12$4dY7PW6aQRtt50x7dArb0uBfvps.vkeds4WiWxGtW.b23UvpE9hQ2'), -- Password = Admin123!
  ('test2@test.com', 'user3', '$2a$12$4dY7PW6aQRtt50x7dArb0uBfvps.vkeds4WiWxGtW.b23UvpE9hQ2'); -- Password = Admin123!

INSERT INTO events (title, date_of_event, user_id)
VALUES
  ('Event 1', '2020-02-10', 1),
  ('Event 2', '2020-03-05', 1),
  ('Event 3', '2020-04-12', 2),
  ('Event 4', '2020-05-25', 3);

INSERT INTO general (title, user_id)
VALUES
  ('Work', 2),
  ('School', 1),
  ('Gym', 2);

INSERT INTO event_items (item, list_id)
VALUES
  ('Sleeping bag', 1),
  ('Tent', 1),
  ('Water', 1),
  ('Cake', 2),
  ('Napkins', 2),
  ('Plates', 2);

INSERT INTO general_items (item, list_id)
VALUES
  ('Backpack', 1),
  ('Paper', 1),
  ('Pencil', 1);

COMMIT;