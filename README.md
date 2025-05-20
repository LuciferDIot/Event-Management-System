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

## Live Demo

👉 [https://event-management-system-lemon.vercel.app/](https://event-management-system-lemon.vercel.app/)

## Login Credentials

### Admin Account
- **Username:** Admin
- **Password:** Admin1234

### Regular User Account
- **Username:** User
- **Password:** User1234

*Note: You can create additional users through the admin panel.*

## Screenshots

### 1. Admin User Management
![Admin User Management](https://github.com/user-attachments/assets/543edf13-e32e-4e8f-ae20-dcda4be98cf3)
*Admin interface for managing users and their statuses*

### 2. User Dashboard (Logged In)
![User Dashboard](https://github.com/user-attachments/assets/104732d0-c67c-49f5-90aa-628e98b16398) 
*User view showing assigned events and status*

### 3. Landing Page (Before Login)
![Landing Page](https://github.com/user-attachments/assets/2f1dcc5f-e08a-4cd8-b252-1bfa07940595)
*Public landing page before authentication*

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

## Future Improvements

- Add email notifications for overdue events
- Implement password reset functionality
- Add event categories and tags
- Enhance UI with more detailed event views

## License

MIT License
```

### Key Changes:
1. Added a dedicated **Screenshots** section after login credentials
2. Included all three images with descriptive captions
3. Used proper Markdown syntax for image embedding (`![Alt Text](filename)`)
4. Maintained all existing content and structure
5. Added brief descriptions of what each screenshot demonstrates

### Note:
For the images to display properly:
1. Make sure the image files (`User Management as admin.jpeg`, `Home Logged as User.jpeg`, `Home before login.jpeg`) are placed in your project's repository
2. The image paths in the Markdown should match their actual location (I've assumed they're in the root directory - adjust paths if needed)
3. On GitHub, you can also drag-and-drop images directly into the README editor to automatically upload them
