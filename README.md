```markdown
# EnrollX

EnrollX is a student course registration portal built with React for the frontend and Express for the backend. It allows users to register, log in, and manage their courses efficiently. The system features secure authentication, a user-friendly interface, and a robust database to store student information.

## Features

- **User Registration**: Allows students to create an account and manage their profile.
- **Login/Logout**: Secure authentication with session management.
- **Password Reset**: Students can reset their password using their registered email.
- **Course Registration**: Students can view and register for available courses.
- **Admin Dashboard**: Admin users can manage course offerings and view registered students.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js (Node.js)
- **Database**: SQL Server
- **Authentication**: JWT (JSON Web Tokens)
- **Styles**: CSS/SCSS

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) (for backend)
- [Git](https://git-scm.com/)

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/mmujtabah/EnrollX.git
   cd EnrollX
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up your database (make sure to configure the SQL Server connection in the backend).

5. Run the backend server:
   ```bash
   cd backend
   npm start
   ```

6. Run the frontend application:
   ```bash
   cd frontend
   npm start
   ```

   The frontend should now be accessible at `http://localhost:3000`.

### Environment Variables

The backend requires certain environment variables. Create a `.env` file in the backend directory and configure the following:

```
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASS=your-database-password
JWT_SECRET=your-secret-key
```

## Contributing

We welcome contributions to EnrollX! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## License

This project is licensed under the MIT License