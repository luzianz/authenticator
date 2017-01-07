CREATE TABLE users (
	id
		INTEGER NOT NULL
		PRIMARY KEY AUTOINCREMENT,

	email
		VARCHAR (128) NOT NULL
		UNIQUE,

	bcrypt_password
		CHAR (60) NOT NULL,

	when_created
		DATETIME NOT NULL
		DEFAULT (CURRENT_TIMESTAMP)
);

CREATE INDEX ix_users_by_email ON users (email);

CREATE INDEX ix_users_by_when_created ON users (when_created);