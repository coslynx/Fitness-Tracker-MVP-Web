-- src/database/migrations/_init_.sql

-- This migration file initializes the database schema for the Fitness Tracker MVP. 
-- It creates essential tables to store user data, goals, activities, and progress information.

-- Ensure to implement robust error handling in the surrounding code (services, controllers) to manage potential database errors and ensure data integrity.
-- Consider utilizing a secure password hashing library (like bcrypt) to protect user passwords.
-- Monitor database performance for potential bottlenecks as the MVP scales, and optimize queries accordingly. 
-- Conduct security reviews regularly to mitigate potential vulnerabilities. 

-- Create the "users" table for storing user accounts
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    gender VARCHAR(255),
    age INT,
    weight FLOAT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the "goals" table for storing user fitness goals
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    target FLOAT NOT NULL,
    timeframe VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    progress FLOAT,
    units VARCHAR(255),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the "activities" table for storing user workout data
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    type VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    duration INT NOT NULL,
    intensity VARCHAR(255),
    calories_burned INT,
    distance FLOAT,
    notes TEXT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the "progress" table for storing user progress metrics
CREATE TABLE progress (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    weight_loss_progress FLOAT,
    calories_burned_total INT,
    distance_covered_total FLOAT,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- This migration ensures that the initial database schema is set up correctly.
-- It defines core tables for the MVP, ensuring data storage for users, goals, activities, and progress.
-- Each table includes relevant data fields, relationships, and timestamps for tracking changes.

-- Ensure to implement robust error handling in the surrounding code (services, controllers) to manage potential database errors and ensure data integrity.
-- Consider utilizing a secure password hashing library (like bcrypt) to protect user passwords.
-- Monitor database performance for potential bottlenecks as the MVP scales, and optimize queries accordingly. 
-- Conduct security reviews regularly to mitigate potential vulnerabilities.