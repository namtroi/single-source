# API Specification (Contract)

**Base URL:** `/api`

This document defines the API contract between the frontend (client) and backend (server). All requests and responses use JSON.

---

## 1. Authentication

All protected endpoints require a JSON Web Token (JWT) to be sent in the request header:

`Authorization: Bearer <token>`

### Data Model: `AuthResponse`

```json
{
  "token": "string (jwt)",
  "user": {
    "id": "integer",
    "username": "string"
  }
}
```

### Endpoints

| Feature           | Method | Endpoint             | Request Body                                     | Response (200/201) | Error (4xx)                                                           | Notes                        |
| :---------------- | :----- | :------------------- | :----------------------------------------------- | :----------------- | :-------------------------------------------------------------------- | :--------------------------- |
| **Register User** | `POST` | `/api/auth/register` | `{ "username": "string", "password": "string" }` | `AuthResponse`     | 400: "Username already exists" <br> 400: "Username/Password required" | Creates a new user.          |
| **Login User**    | `POST` | `/api/auth/login`    | `{ "username": "string", "password": "string" }` | `AuthResponse`     | 401: "Invalid credentials"                                            | Logs in user, returns token. |

---

## 2\. Public User Page

This endpoint is public and does **not** require authentication. It's used to fetch the data for a user's public-facing profile.

### Data Model: `PublicProfile`

```json
{
  "id": "integer",
  "username": "string",
  "links": [
    {
      "id": "integer",
      "title": "string",
      "url": "string"
    }
    // ... more links
  ]
}
```

### Endpoints

| Feature             | Method | Endpoint               | Request Body | Response (200)  | Error (4xx)           | Notes                            |
| :------------------ | :----- | :--------------------- | :----------- | :-------------- | :-------------------- | :------------------------------- |
| **Get Public Page** | `GET`  | `/api/users/:username` | (None)       | `PublicProfile` | 404: "User not found" | Fetches user info + their links. |

---

## 3\. Link Management (Protected)

All endpoints in this section are **protected**. They require a valid `Authorization: Bearer <token>` header.

The API must verify that the authenticated user (`user_id` from the token) is the owner of the `linkId` they are trying to modify (PUT/DELETE).

### Data Model: `Link`

```json
{
  "id": "integer",
  "title": "string",
  "url": "string",
  "user_id": "integer"
}
```

### Endpoints

| Feature          | Method   | Endpoint             | Request Body                             | Response (200/201)        | Error (4xx)                                                                      | Notes                                                      |
| :--------------- | :------- | :------------------- | :--------------------------------------- | :------------------------ | :------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| **Get My Links** | `GET`    | `/api/links`         | (None)                                   | `[Link, ...]`             | 401: "Unauthorized"                                                              | Gets all links for the logged-in user (for the Dashboard). |
| **Create Link**  | `POST`   | `/api/links`         | `{ "title": "string", "url": "string" }` | `Link` (The new link)     | 401: "Unauthorized" <br> 400: "Title/URL required"                               | Creates a new link for the logged-in user.                 |
| **Update Link**  | `PUT`    | `/api/links/:linkId` | `{ "title": "string", "url": "string" }` | `Link` (The updated link) | 401: "Unauthorized" <br> 403: "Forbidden" (Not owner) <br> 404: "Link not found" | Updates a specific link.                                   |
| **Delete Link**  | `DELETE` | `/api/links/:linkId` | (None)                                   | `204 No Content`          | 401: "Unauthorized" <br> 403: "Forbidden" (Not owner) <br> 404: "Link not found" | Deletes a specific link.                                   |

---

## 4\. (Optional) Health Check

| Feature          | Method | Endpoint      | Request Body | Response (200)                                       |
| :--------------- | :----- | :------------ | :----------- | :--------------------------------------------------- |
| **Health Check** | `GET`  | `/api/health` | (None)       | `{ "status": "ok", "message": "Server is running" }` |
