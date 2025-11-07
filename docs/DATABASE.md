# Database Schema (PostgreSQL)

This document details the database schema for the `single-source` project.

## 1. Schema Design

We use a relational model with two primary tables: `users` and `links`.

### Table: `users`

This table stores the authentication and profile information for each user.

| Column          | Type           | Constraints                  | Description                                   |
| :-------------- | :------------- | :--------------------------- | :-------------------------------------------- |
| `id`            | `SERIAL`       | **Primary Key**              | Unique identifier for the user.               |
| `username`      | `VARCHAR(255)` | **Unique**, **Not Null**     | The user's public, unique username.           |
| `password_hash` | `VARCHAR(255)` | **Not Null**                 | The user's securely hashed (bcrypt) password. |
| `created_at`    | `TIMESTAMP`    | Default: `CURRENT_TIMESTAMP` | When the user account was created.            |

### Table: `links`

This table stores all links associated with a user.

| Column       | Type            | Constraints                   | Description                                         |
| :----------- | :-------------- | :---------------------------- | :-------------------------------------------------- |
| `id`         | `SERIAL`        | **Primary Key**               | Unique identifier for the link.                     |
| `title`      | `VARCHAR(255)`  | **Not Null**                  | The display text for the link (e.g., "My YouTube"). |
| `url`        | `VARCHAR(2048)` | **Not Null**                  | The full destination URL (e.g., "https://...").     |
| `user_id`    | `INTEGER`       | **Foreign Key**, **Not Null** | References `users(id)` to link to the owner.        |
| `created_at` | `TIMESTAMP`     | Default: `CURRENT_TIMESTAMP`  | When the link was created.                          |

## 2. Relationship: One-to-Many

The core relationship is **one-to-many**:

- One `user` can have many `links`.
- Each `link` belongs to exactly one `user`.

This is achieved by the `links.user_id` foreign key, which points to the `users.id` primary key.

We also use `ON DELETE CASCADE`. This means if a user is deleted from the `users` table, all of their associated links in the `links` table will be automatically deleted, preventing orphaned data.

## 3. Full SQL Setup Script

You can run this script in your PostgreSQL database (e.g., `single_source_dev`) to create the entire schema.

```sql
-- Create the 'users' table first, as 'links' depends on it
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the 'links' table
CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(2048) NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Define the foreign key relationship
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- Optional: Create an index for faster lookups of links by user
CREATE INDEX idx_links_user_id ON links(user_id);

-- Optional: Create an index for faster lookups of users by username
CREATE INDEX idx_users_username ON users(username);
```
