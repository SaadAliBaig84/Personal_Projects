# 📚 Book Notes App

A MERN stack web application for managing book notes with **Google Drive** and **Google Docs API** integration.  
Easily store, search, and organize your reading notes in the cloud.

---

## 🚀 Features

- **Google Drive & Docs API Integration** — Create and manage notes directly in Google Docs, synced with Google Drive.
- **Secure Authentication** — OAuth2 login with Google and JWT-based session management.
- **Dynamic Search** — Fast, case-insensitive search for notes.
- **Pagination & Incremental Loading** — Efficient browsing of large note collections.
- **Responsive Design** — Works seamlessly on desktop and mobile devices.

---

## 🛠️ Tech Stack

**Frontend:** React.js, TailwindCSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB (Mongoose ORM)  
**Authentication:** Google OAuth2, JWT  
**APIs:** Google Drive API, Google Docs API

---


2️⃣ Install dependencies

# Install frontend dependencies
cd client && npm install
# Install backend dependencies
cd ../server && npm install


3️⃣ Set up environment variables
Create a .env file in the server/ folder with the following:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret


4️⃣ Run the application

# Run backend
cd server && npm start
# Run frontend
cd client && npm start

🔑 OAuth2 Setup

Create credentials in Google Cloud Console.

Enable Google Drive API and Google Docs API.

Add redirect URIs for OAuth consent.

📌 Roadmap

 Note tagging & categorization

 Rich text editor integration

 Export notes as PDF

📄 License

This project is licensed under the MIT License.

👤 Author

Saad Ali Baig

## 📂 Project Structure

