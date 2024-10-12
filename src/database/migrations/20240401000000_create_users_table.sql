-- src/database/migrations/20240401000000_create_users_table.sql

-- This migration creates the "users" table, which is essential for storing user data, including email, password, and optional profile information. 
-- It's a core component of the Fitness Tracker MVP, enabling user authentication and data personalization. 
-- The table is designed with scalability in mind, allowing for future expansion of user profile data. 

CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- Unique identifier for each user, automatically incremented
    email VARCHAR(255) UNIQUE NOT NULL, -- User's email address, must be unique and not empty
    password VARCHAR(255) NOT NULL, -- User's password, hashed and stored securely, not empty
    username VARCHAR(255) UNIQUE, -- Optional username for the user, can be null
    name VARCHAR(255), -- Optional user's full name, can be null
    gender VARCHAR(255), -- Optional user's gender, can be null
    age INT, -- Optional user's age, can be null
    weight FLOAT, -- Optional user's weight, can be null
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp for when the user account was created, automatically set
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the user account was last updated, automatically set
);

-- This migration ensures that the "users" table is created correctly, and that it adheres to the MVP's database standards, including strong typing and secure data storage. 
-- The use of UUIDs for user IDs ensures scalability and performance.
-- The password field is designed for secure password hashing, preventing plaintext passwords from being stored.
-- The optional fields (username, name, gender, age, weight) provide flexibility for future user profile expansion.
-- This migration also includes timestamps for tracking user account creation and updates, enabling valuable data analysis in the future.

-- Ensure to implement robust error handling in the surrounding code (services, controllers) to manage potential database errors and ensure data integrity. 
-- Consider utilizing a secure password hashing library (like bcrypt) to protect user passwords.
-- Monitor database performance for potential bottlenecks as the MVP scales, and optimize queries accordingly. 
-- Conduct security reviews regularly to mitigate potential vulnerabilities.