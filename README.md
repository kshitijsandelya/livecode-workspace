# 💻 LiveCode Collaborative Workspace

**🟢 Live Demo:** [https://livecode-workspace.vercel.app](https://livecode-workspace.vercel.app)

LiveCode is a real-time, distributed collaborative code editor. It allows multiple developers to join a secure workspace via a shared Room ID, write code synchronously with zero-latency, and execute their code live across 15+ programming languages.

## ✨ Features

- **Real-Time Collaboration:** Sub-second code syncing across multiple clients using WebSockets.
- **Live Code Compilation:** Integrated JDoodle API to compile and run code (Python, C++, Java, Node.js, etc.) directly in the browser.
- **Custom IDE UI:** A sleek, VS Code-inspired dark theme (`#121212`) with a sliding terminal overlay for outputs.
- **Secure Architecture:** API credentials are protected via a custom Node.js backend proxy.

## 🛠️ Tech Stack

- **Frontend:** React.js, CodeMirror, Socket.io-client, Axios
- **Backend:** Node.js, Express.js, Socket.io
- **Deployment:** Vercel (Frontend) & Render (Backend)

## 🚀 How to Run Locally

If you want to run this project on your own machine:

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/kshitijsandelya/livecode-workspace.git](https://github.com/kshitijsandelya/livecode-workspace.git)
   cd livecode-workspace
   ```

2. **Start the Backend:**

   ```bash
   cd server
   npm install
   npm start
   ```

3. **Start the Frontend:**
   ```bash
   cd client
   npm install
   npm start
   ```
