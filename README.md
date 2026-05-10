# PSUT Physics Hub

PSUT Physics Hub is a web platform designed for university students taking Physics 2 at PSUT. It provides a simple and collaborative space where students can ask questions, share solutions, and help each other understand challenging physics concepts.

The platform focuses on topics such as electric fields, circuits, and other core Physics 2 material. Instead of struggling alone, students can post questions and receive answers from classmates or instructors in an organized and accessible way.

---

## Features

- User authentication (signup, login, logout) using JWT
- Create and browse physics-related questions
- Answer questions and participate in discussions
- User profile page showing posts and answers
- Image upload support for questions (via cloud storage)
- Clean and simple interface focused on usability

---

## Tech Stack

### Frontend
- React
- CSS

### Backend
- Node.js
- Express
- JWT Authentication

### Database & Storage
- PostgreSQL (via Supabase)
- Supabase Storage for image uploads

---

## Project Structure

text frontend/       → React application db/             → database schema (SQL) server.js       → Express server 

---

## Deployment

- Backend and frontend are deployed using Render  
- Database and storage are handled by Supabase  

---

## Future Improvements

- LaTeX support for writing equations  
- Search functionality  
- Upvoting answers  
- More instructor capabilites

---

## Notes

This project was developed as a university project and is intentionally kept simple while focusing on core functionality. It demonstrates full-stack development, authentication, database design, and deployment.

---

## Try it

-Go to https://physics-forums.onrender.com/ , make an account and post your physics question 
