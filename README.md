```markdown
# Event Management System

A simple event management application built with Next.js and MongoDB, designed for user and event management with admin and user roles.

## Features

- **User Management**
  - Admin can create, remove, and deactivate user accounts
  - Admin can allocate events to users
- **Event Management**
  - Users can view their pending and overdue events
  - Users can update event status (Pending/Completed/Overdue)
  - Automatic overdue status detection (when expected date passes)
- **Authentication**
  - Secure login system
  - Role-based access control

## Technologies Used

- Frontend: Next.js, React, Tailwind CSS
- Backend: Next.js API routes
- Database: MongoDB
- Authentication: Custom session management

## Login Credentials

### Admin Account
- **Username:** Admin
- **Password:** Admin1234

### Regular User Account
- **Username:** User
- **Password:** User1234

*Note: You can create additional users through the admin panel.*

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/event-management-app.git
   cd event-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:
   ```
   MONGODB_URI=your_mongodb_connection_string
   SECRET_KEY=your_session_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### User Collection
```javascript
{
  username: String,       // Unique username
  email: String,          // User email
  password: String,       // Hashed password
  isActive: Boolean,      // Account status
  role: String,           // 'admin' or 'user'
  createdAt: Date,
  updatedAt: Date
}
```

### Event Collection
```javascript
{
  eventName: String,      // Name of the event
  expectedDate: Date,     // Expected completion date
  status: String,        // 'Pending', 'Completed', or 'Overdue'
  note: String,           // Additional notes
  userId: ObjectId,       // Reference to the assigned user
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user (admin only)
- `GET /api/events` - Get user's events
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/:id` - Update event status

## Screenshots

(Add your application screenshots here)

## Future Improvements

- Add email notifications for overdue events
- Implement password reset functionality
- Add event categories and tags
- Enhance UI with more detailed event views

## License

MIT License
```

### Key Changes Made:
1. Updated admin credentials to:
   - Username: `Admin`
   - Password: `Admin1234`

2. Updated user credentials to:
   - Username: `User`
   - Password: `User1234`

3. Maintained all other functionality and structure from the original README

This file is ready to copy-paste into your `README.md`. The Markdown formatting will work perfectly on GitHub or any other Markdown viewer.
