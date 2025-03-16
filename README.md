# EnrollX

EnrollX is a student course registration portal built with **React** for the frontend and **Express** for the backend. It provides a seamless experience for students to register, log in, and manage their courses efficiently. The system features secure authentication, a user-friendly interface, and a robust database to store student information.

---

## Features

- **User Registration**: Students can create an account and manage their profile.
- **Login/Logout**: Secure authentication with session management using JWT (JSON Web Tokens).
- **Password Reset**: Students can reset their password via their registered email.
- **Course Registration**: Students can browse and register for available courses.
- **Admin Dashboard**: Admins can manage course offerings and view registered students.

---

## Tech Stack

- **Frontend**: React.js
- **Backend**: Express.js (Node.js)
- **Database**: SQL Server
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: CSS/SCSS

---

## Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [SQL Server](https://www.microsoft.com/en-us/sql-server) (for backend database)
- [Git](https://git-scm.com/)

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mmujtabah/EnrollX.git
   cd EnrollX ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up the database**:
   - Configure the SQL Server connection in the backend.
   - Ensure the database is running and accessible.

5. **Run the backend server**:
   ```bash
   cd ../backend
   npm start
   ```

6. **Run the frontend application**:
   ```bash
   cd ../frontend
   npm start
   ```

   The frontend will be accessible at `http://localhost:3000`.

### Environment Variables

The backend requires certain environment variables. Create a `.env` file in the `backend` directory and add the following:

```env
DB_HOST=your-database-host
DB_USER=your-database-username
DB_PASS=your-database-password
JWT_SECRET=your-secret-key
```

---

## Contributing

We welcome contributions to EnrollX! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

Please ensure your code follows the project's coding standards and includes appropriate tests.

---

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## Support

For any issues or questions, please open an issue on the [GitHub repository](https://github.com/mmujtabah/EnrollX/issues).