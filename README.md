# MyBlog – Full Stack Blog Application

A full-stack blog application that allows users to register, log in securely, create and manage their own blog posts, and explore published blogs.

## 🚀 Features

### User Authentication

* User registration
* Secure login
* JWT-based authentication
* Protected dashboard
* Logout functionality
* User profile information

### Blog Management

* Create new blog posts
* View published blogs
* View individual blog details
* Edit your own blogs
* Delete your own blogs
* Search blogs by title or content
* Filter blogs by category

### User Dashboard

* Personalized dashboard
* Displays the logged-in user's blogs
* Profile name and email
* Edit and delete controls
* Search and category filtering

### UI & Responsiveness

* Clean and modern interface
* Responsive layout
* Mobile-friendly design
* Responsive navigation
* Responsive blog cards and forms

## 🛠️ Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* bcrypt

## 📁 Project Structure

```text
blog-appplication/
│
├── backend/
│   ├── server.js
│   ├── User.js
│   ├── Blog.js
│   ├── package.json
│   └── package-lock.json
│
├── css/
│   └── style.css
│
├── js/
│   ├── script.js
│   ├── dashboard.js
│   └── blog-details.js
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── create-blog.html
├── blog-details.html
└── README.md
```

## ⚙️ How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/himabindubomma023-commits/blog-application2.git
```

### 2. Open the project

```bash
cd blog-appplication
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Do not share or commit your `.env` file.

### 5. Start the server

```bash
node server.js
```

The application will run at:

```text
http://localhost:3000
```

## 🔐 Authentication Flow

1. A user registers an account.
2. The user logs in using their email and password.
3. The server verifies the credentials.
4. A JWT token is generated after successful login.
5. The token is stored by the frontend.
6. Protected requests send the token using the Authorization header.
7. The server verifies the token before allowing protected operations.

## 📝 Blog Authorization

Users can manage their own blog posts through the protected dashboard.

The backend verifies the authenticated user before allowing:

* Blog creation
* Blog editing
* Blog deletion
* Access to the user's personal dashboard data

## 🌐 API Endpoints

| Method | Endpoint         | Purpose                    |
| ------ | ---------------- | -------------------------- |
| POST   | `/api/register`  | Register a new user        |
| POST   | `/api/login`     | Login user                 |
| GET    | `/api/blogs`     | Get all blogs              |
| GET    | `/api/blogs/:id` | Get a single blog          |
| POST   | `/api/blogs`     | Create a blog              |
| GET    | `/api/my-blogs`  | Get logged-in user's blogs |
| PUT    | `/api/blogs/:id` | Edit a blog                |
| DELETE | `/api/blogs/:id` | Delete a blog              |
| GET    | `/api/test`      | Test backend API           |

## 📱 Responsive Design

The application has been tested at different screen sizes, including mobile-width layouts.

The interface adapts to smaller screens by adjusting:

* Navigation
* Blog cards
* Forms
* Search and filter controls
* Dashboard layout
* Action buttons
* Footer

## 🎓 Learning Outcomes

Through this project, I learned how to:

* Build a full-stack web application
* Create REST APIs using Express.js
* Connect a Node.js application with MongoDB
* Implement JWT authentication
* Protect API routes
* Implement authorization
* Work with frontend and backend integration
* Perform CRUD operations
* Create responsive web interfaces
* Debug full-stack applications
* Use Git and GitHub for version control

## 👩‍💻 Author

**Himabindu Bomma**

Built as a hands-on full-stack web development project with **CodeMax**.

## 📌 Project Status

The project has been completed through the authentication, dashboard, UI improvement, responsive design, and final-project stages.

Deployment is the next stage of the project.
