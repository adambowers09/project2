CREATE TABLE destinations (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    city VARCHAR(30) NOT NULL,
    country_state VARCHAR(30) NOT NULL,
    activities TEXT,
	recommendations VARCHAR(30),
    dates_travelled INTEGER NOT NULL,
    memories VARCHAR(30)
    );