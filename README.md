# 🚀 DevSync – Developer Collaboration Platform

DevSync is a full-stack web application designed to help developers manage their projects, tasks, and teams efficiently. With real-time task management, team collaboration features, AI-powered project summaries, and a modern UI — DevSync is your all-in-one productivity companion.

---

## 🌟 Features

- ✅ **Create & Manage Projects**
- 🧩 **Task CRUD Operations**
- 🟡 **Status Tracking**: Pending, In Progress, Completed
- 👥 **Team Collaboration**: Invite users via email
- 📈 **Project Dashboard**: Task stats visualization
- 🧠 **AI Summary of Progress** *(via GPT-3.5 on OpenRouter)*
- 📄 **Export Tasks as CSV**
- 🔐 **Secure JWT Authentication**
- 📢 **Toast Notifications for UI Feedback**
- 🧑‍💼 **Developer Profile Page**
- 📱 **Responsive Design**

---

## 🛠 Tech Stack

### 🧩 Frontend

- React.js (with Hooks)
- Tailwind CSS + Material UI
- Axios
- React Toastify
- React CSV Export
- React Router DOM

### 🔧 Backend

- Node.js & Express.js
- MongoDB + Mongoose
- JWT Authentication
- OpenRouter API (OpenAI GPT-3.5)
- dotenv, CORS, Helmet

---


## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/MayurChaudhary198/DevSync.git
cd DevSync

# Frontend setup
cd client
npm install
npm start

# Backend setup
cd ../server
npm install
npm run dev
