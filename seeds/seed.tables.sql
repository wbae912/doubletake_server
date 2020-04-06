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

INSERT INTO events (title, date_of_event, city, state, country, user_id)
VALUES
  ('Event 1', '2020-02-10', 'La Canada', 'CA', 'US', 1),
  ('Event 2', '2020-03-05', 'Los Angeles', 'CA', 'US', 1),
  ('Event 3', '2020-04-12', 'Tokyo', NULL, 'Japan', 2),
  ('Event 4', '2020-05-25', 'Seoul', NULL, 'South Korea', 3);

INSERT INTO general (title, user_id)
VALUES
  ('Work', 2),
  ('School', 1),
  ('Gym', 2);

INSERT INTO event_items (item, user_id, list_id)
VALUES
  ('Sleeping bag', 1, 1),
  ('Tent', 1, 1),
  ('Water', 1, 1),
  ('Cake', 2, 3),
  ('Napkins', 2, 3),
  ('Plates', 2, 3);

INSERT INTO general_items (item, user_id, list_id)
VALUES
  ('Backpack', 1, 2),
  ('Paper', 1, 2),
  ('Pencil', 1, 2),
  ('Laptop', 2, 1),
  ('Briefcase', 2, 1),
  ('Protein', 2, 3),
  ('Duffle Bag', 2, 3),
  ('Jumprope', 2, 3);

COMMIT;