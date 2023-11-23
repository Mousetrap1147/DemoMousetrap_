CREATE TABLE Account (
  id SERIAL NOT NULL,
  username varchar(255) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  password_salt varchar(255) NOT NULL,
  PRIMARY KEY (id)
);