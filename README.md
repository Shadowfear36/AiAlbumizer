# AI Albumizer 📸🧠

A full-stack facial recognition photo album app that uses AI to detect, cluster, and organize faces across your image collection.

## 🚀 Features

- 🔐 JWT-based authentication with secure HttpOnly cookies
- 🧠 Deep learning face detection & embedding using:
  - `RetinaFace` for detection
  - `DeepFace (ArcFace)` for embeddings
- 🗂️ Clustering via `DBSCAN` and album creation per detected identity
- 🖼️ Thumbnail previews for each album (face cluster)
- 🧾 Django backend with PostgreSQL
- ⚛️ Next.js + Tailwind frontend
- 🐳 Fully Dockerized (Docker + Docker Compose)

---

## 🏗️ Tech Stack

| Layer        | Tech                                      |
|--------------|-------------------------------------------|
| Frontend     | Next.js, React, TailwindCSS, Redux        |
| Backend      | Django, Django REST Framework, SimpleJWT  |
| AI Models    | RetinaFace, DeepFace (ArcFace)            |
| Database     | PostgreSQL                                |
| Auth         | JWT (access & refresh cookies)            |
| Deployment   | Docker, Docker Compose                    |

---

## 📪 API Endpoints

| Endpoint                    | Method | Description                         |
|-----------------------------|--------|-------------------------------------|
| `/api/register/`            | POST   | Register new user                   |
| `/api/token/`               | POST   | Obtain JWT access/refresh           |
| `/api/token/refresh/`       | POST   | Refresh access token                |
| `/api/logout/`              | POST   | Logout (clears cookies)             |
| `/api/users/`               | GET    | (Admin only) List all users         |
| `/api/photos/`              | GET    | List uploaded photos                |
| `/api/photos/`              | POST   | Upload photo + detect faces         |
| `/api/faces/{id}/`          | DELETE | Delete a face                       |
| `/api/albums/`              | GET    | List user albums                    |
| `/api/albums/{id}/`         | PATCH  | Update album info (name, etc.)      |
| `/api/albums/{id}/faces/`   | GET    | Get all faces in the album          |
---

## 📦 Installation (Local Dev)

> Requires: Docker + Docker Compose

1. **Clone the repo:**

```bash
git clone https://github.com/yourusername/ai-albumizer.git
cd ai-albumizer
```
---

2. **Create a .env File in Root**
POSTGRES_DB=albumizer
POSTGRES_USER=albumuser
POSTGRES_PASSWORD=supersecurepassword
SECRET_KEY=django-insecure-key

---


3. **Run The Application**
```bash
docker-compose up --build
```

---
## 👨‍💻 Developer Notes
- All face embeddings are stored as binary blobs (float32 arrays)

- Each photo is saved in memory (DB BinaryField)

- Album thumbnails are generated from the first detected face

- DBSCAN is used for clustering based on cosine similarity

---

## 🤝 Created by
Dylan Rhinehart
👨‍💻 Software Engineer @ Setton Farms
📬 dylanrhinehart@gmail.com