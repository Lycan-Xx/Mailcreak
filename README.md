# Mailcreak - Email Subscription Service

Mailcreak is a modern email subscription service that allows organizations to manage their newsletter subscriptions and user base effectively.

## Features

### User Management
- Role-based access control (User, Admin, Superuser)
- Secure authentication with email/password
- User profile management
- Comprehensive user dashboard

### Newsletter Management
- Create and schedule newsletters
- Rich text editor for content creation
- Category-based organization
- Automated email delivery system

### Admin Features
- User management dashboard
- Newsletter analytics
- System configuration
- Access control management

### Security
- Password hashing
- Protected routes
- Secure API endpoints
- Session management
- Input validation

## Tech Stack

- Frontend: React with TypeScript
- Styling: Tailwind CSS
- Database: Supabase
- Authentication: Supabase Auth
- State Management: React Context
- Icons: Lucide React

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Default Users

The system comes with three default user accounts:

1. Superuser
   - Email: superuser@mailcreak.com
   - Password: SuperPass123!

2. Admin
   - Email: admin@mailcreak.com
   - Password: AdminPass123!

3. Regular User
   - Email: user@mailcreak.com
   - Password: UserPass123!

## Database Schema

The application uses the following main tables:

1. profiles
   - User profile information
   - Role-based access control
   - Personal details

2. newsletters
   - Newsletter content
   - Scheduling information
   - Status tracking

3. subscriptions
   - User subscriptions
   - Category mapping
   - Subscription management

4. categories
   - Newsletter categories
   - Organization structure

5. resources
   - Additional resources
   - Access level control

## Security Considerations

- All passwords are hashed
- Row Level Security (RLS) enabled
- Protected API endpoints
- Input validation on all forms
- Secure session management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License