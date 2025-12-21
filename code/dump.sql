
DROP DATABASE IF EXISTS gymrank;
CREATE DATABASE gymrank CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE gymrank;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    goal VARCHAR(255),
    rank VARCHAR(50),
    height_cm INT,
    sexe ENUM('homme', 'femme', 'autre'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);


CREATE TABLE workouts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    description TEXT,
    started_at DATETIME,
    ended_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_workouts_user ON workouts(user_id);


CREATE TABLE exercices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    groupe_musculaire VARCHAR(100),
    moyenne_monde_poid INT
);

CREATE INDEX idx_exercices_groupe ON exercices(groupe_musculaire);


CREATE TABLE workout_exercice (
    id INT AUTO_INCREMENT PRIMARY KEY,
    workout_id INT NOT NULL,
    exercice_id INT NOT NULL,
    sets INT NOT NULL,
    reps INT NOT NULL,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
    FOREIGN KEY (exercice_id) REFERENCES exercices(id) ON DELETE CASCADE
);

CREATE INDEX idx_wk_exo_workout ON workout_exercice(workout_id);
CREATE INDEX idx_wk_exo_exercice ON workout_exercice(exercice_id);


CREATE TABLE statistique (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    exercice_id INT NOT NULL,
    poids FLOAT NOT NULL,
    reps INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercice_id) REFERENCES exercices(id) ON DELETE CASCADE
);

CREATE INDEX idx_stats_user ON statistique(user_id);
CREATE INDEX idx_stats_exercice ON statistique(exercice_id);
