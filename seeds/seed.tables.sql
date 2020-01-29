BEGIN;

TRUNCATE
  general,
  events,
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (email, username, password)
VALUES
  ('test@test.com', 'user1', '$2a$12$4dY7PW6aQRtt50x7dArb0uBfvps.vkeds4WiWxGtW.b23UvpE9hQ2'),
  ('test1@test.com', 'user2', '$2a$12$4dY7PW6aQRtt50x7dArb0uBfvps.vkeds4WiWxGtW.b23UvpE9hQ2'),
  ('test2@test.com', 'user3', '$2a$12$4dY7PW6aQRtt50x7dArb0uBfvps.vkeds4WiWxGtW.b23UvpE9hQ2');

INSERT INTO events (title, date_of_event, items, user_id)
VALUES
  ('Event 1', '2020-02-10', 'Napkin, towel, fork, spoon', 1),
  ('Event 2', '2020-03-05', 'Battery, flashlight, matches', 1),
  ('Event 3', '2020-04-12', 'Homework, backpack, laptop', 2),
  ('Event 4', '2020-05-25', 'Basketball, shoes, water', 3);

INSERT INTO general (title, items, user_id)
VALUES
  ('Work', 'Bag, laptop', 2),
  ('School', 'Laptop, textbook, phone', 1),
  ('Gym', 'Bag, water, phone', 2);

COMMIT;