export const tablesQueries = [
  {
    table: "users",
    query: `CREATE TABLE users (
       id CHAR(32) NOT NULL DEFAULT (REPLACE(UUID(), '-', '')),
      name VARCHAR(30) DEFAULT NULL,
      username VARCHAR(30) DEFAULT NULL,
      mail VARCHAR(50) NOT NULL,
      password VARCHAR(150),
      photo VARCHAR(150) DEFAULT "",
      status TINYINT DEFAULT 0,
      access SMALLINT DEFAULT 0,
      refresh_token VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id)
    ) ENGINE=InnoDB;
     INSERT INTO users(name,mail,access,password) VALUES ('admin','samsadr98@gmail.com',10,'$2b$07$F.We9OLHYQqokYy4BbVxXuNG8lrf94beyYzHuTKUz3g4W1k04fi.G');
    `,
  },
  {
    table: "icons",
    query: `CREATE TABLE icons (
       id CHAR(32) NOT NULL DEFAULT (REPLACE(UUID(), '-', '')),
      title VARCHAR(30) NOT NULL,
      PRIMARY KEY(id)
    ) ENGINE=InnoDB;`,
  },
  {
    table: "apps",
    query: `CREATE TABLE apps (
       id CHAR(32) NOT NULL DEFAULT (REPLACE(UUID(), '-', '')),
      title VARCHAR(30) NOT NULL,
      link VARCHAR(50) NOT NULL,
      id_icon  CHAR(32),
      PRIMARY KEY(id),
      FOREIGN KEY(id_icon) REFERENCES icons(id)
    ) ENGINE=InnoDB;`,
  },
  {
    table: "links",
    query: `CREATE TABLE links (
       id CHAR(32) NOT NULL DEFAULT (REPLACE(UUID(), '-', '')),
      id_user  CHAR(32),
      title VARCHAR(20) NOT NULL,
      link VARCHAR(100) DEFAULT '',
      id_icon  CHAR(32),
      position SMALLINT DEFAULT 0,
      is_show TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id),
      FOREIGN KEY(id_icon) REFERENCES icons(id),
      FOREIGN KEY(id_user) REFERENCES users(id)
    ) ENGINE=InnoDB;`,
  },
  {
    table: "socials",
    query: `CREATE TABLE socials (
       id CHAR(32) NOT NULL DEFAULT (REPLACE(UUID(), '-', '')),
      id_user  CHAR(32),
      id_app  CHAR(32),
      username VARCHAR(50) NOT NULL,
      is_show TINYINT DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id),
      FOREIGN KEY(id_app) REFERENCES apps(id),
      FOREIGN KEY(id_user) REFERENCES users(id)
    ) ENGINE=InnoDB;`,
  },
  {
    table: "pincodes",
    query: `CREATE TABLE pincodes (
       id CHAR(32) NOT NULL DEFAULT (REPLACE(UUID(), '-', '')),
      id_user  CHAR(32),
      pin VARCHAR(5) NOT NULL,
      used SMALLINT NOT NULL DEFAULT 0,
      expired_at datetime NOT NULL ,
      PRIMARY KEY(id),
      FOREIGN KEY(id_user) REFERENCES users(id)
    ) ENGINE=InnoDB;`
  },
  {
    table: "views",
    query: `CREATE TABLE views(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_user char(32),
  ip VARCHAR(45) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`
  }
];
