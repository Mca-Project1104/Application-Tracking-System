# 🚀Application Tracking System (ATS)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![Node](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)
![Python](https://img.shields.io/badge/AI_Service-Python-3776AB?logo=python)

A comprehensive, full-stack Application Tracking System designed to streamline the hiring process for companies, candidates, and administrators. This platform features an AI-driven resume analyzer, dynamic hiring pipelines, a centralized job board, and secure Stripe billing integration.

---

## ✨ Features

### 👨‍💻 For Candidates
*   **Job Discovery:** Browse and filter through active job listings.
*   **Application Management:** Apply to jobs and track application status in real-time.
*   **AI Resume Analyzer:** Upload a resume to get AI-driven feedback and ATS scoring.
*   **Candidate Profile:** Maintain a dynamic professional profile.

### 🏢 For Companies
*   **Hiring Pipeline:** Kanban-style board to track candidates through various interview stages.
*   **Job Posting Management:** Create, edit, and manage job listings.
*   **Candidate Insights:** View applicant profiles, resumes, and ATS scores.
*   **Premium Subscriptions:** Stripe-integrated billing for premium employer features.

### 🛡️ For Administrators
*   **Admin Dashboard:** Centralized panel for platform oversight.
*   **User Management:** Manage candidates, companies, and system users.
*   **Analytics & Reports:** Generate system usage and hiring metrics.

---

## 🛠️ Tech Stack

**Frontend**
*   [React.js](https://reactjs.org/) (initialized with [Vite](https://vitejs.dev/))
*   [Tailwind CSS](https://tailwindcss.com/) for rapid UI styling
*   Context API for state management
*   Axios for API requests

**Backend (Node.js)**
*   [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/) with Mongoose ORM
*   JWT Authentication & bcrypt for security
*   Multer for resume/PDF uploads
*   Stripe API for payment processing
*   Nodemailer for email verification/notifications

**AI Microservice (Python)**
*   Python 3.x
*   Grok Model API Integration for Resume Parsing & ATS Scoring

---

## 📁 Project Structure

```text
Application-Tracking-System/
├── Frontend/           # React + Vite application
│   ├── src/
│   │   ├── api/        # Axios configurations
│   │   ├── Components/ # Reusable UI components
│   │   ├── context/    # React Context providers
│   │   ├── Pages/      # Route pages (Admin, Candidate, Company, etc.)
│   │   └── Protected/  # Protected route wrappers
├── Server/             # Node.js/Express backend
│   ├── controller/     # Request handlers
│   ├── database/       # MongoDB connection setup
│   ├── middleware/     # Auth and rate-limiting middlewares
│   ├── model/          # Mongoose database schemas
│   ├── routes/         # Express API routes
│   └── services/       # Stripe, Email, Multer, and ATS Scorer logic
└── Python/             # AI Resume Analysis Microservice
    ├── main.py
    ├── grock_model_api.py
    └── requirements.txt
🚀 Getting Started
Prerequisites
Ensure you have the following installed on your local machine:

Node.js (v18 or higher)

Python (v3.8 or higher)

MongoDB (Local instance or MongoDB Atlas URI)

Stripe Account (For payment gateway API keys)

1. Clone the Repository
Bash
git clone [https://github.com/your-username/Application-Tracking-System.git](https://github.com/your-username/Application-Tracking-System.git)
cd Application-Tracking-System
2. Setup the Node.js Backend
Bash
cd Server
npm install
Create a .env file in the Server directory:

Code snippet
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
PYTHON_API_URL=http://localhost:8000 # URL where python service runs
Start the server:

Bash
npm run dev
3. Setup the React Frontend
Bash
cd ../Frontend
npm install
Create a .env file in the Frontend directory:

Code snippet
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
Start the frontend development server:

Bash
npm run dev
4. Setup the Python AI Microservice
Bash
cd ../Python
pip install -r requirements.txt
Create a .env file in the Python directory (if required by your Grok API integration):

Code snippet
GROK_API_KEY=your_api_key_here
Start the Python server:

Bash
python main.py
🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📝 License
Distributed under the MIT License. See LICENSE for more information.
