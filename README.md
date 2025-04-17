# SalonBook - Salon & Spa Booking Platform

SalonBook is a modern web platform for booking salon and spa services in Morocco, drawing inspiration from Airbnb's elegant UI and booking experience.

![SalonBook Interface](https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80)

## Features

- **User-friendly Interface**: Clean, intuitive design with responsive layout
- **Search & Filter**: Find salons by location, services, and ratings
- **Salon Profiles**: Detailed salon pages with services, photos, and reviews
- **Booking System**: Schedule appointments with real-time availability
- **User Dashboard**: Manage bookings, favorites, and reviews
- **Salon Owner Dashboard**: Manage services, appointments, and salon profile
- **Reviews & Ratings**: Share and browse authentic customer experiences
- **Authentication**: Secure login and registration system

## Tech Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Tailwind CSS with shadcn/ui components
- Wouter for routing
- React Hook Form for form handling

### Backend
- Express.js server
- PostgreSQL database
- Drizzle ORM for database operations
- Passport.js for authentication
- Session-based auth with connect-pg-simple

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/salonbook.git
cd salonbook
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```
# Create a .env file with:
DATABASE_URL=postgresql://username:password@localhost:5432/salonbook
SESSION_SECRET=your-session-secret
```

4. Push database schema
```bash
npm run db:push
```

5. Start the development server
```bash
npm run dev
```

6. Open your browser to `http://localhost:5000`

## Test Accounts

For testing purposes, you can use these pre-seeded accounts:

- **Regular User**:
  - Username: `testuser`
  - Password: `password123`

- **Salon Owner**:
  - Username: `salonowner`
  - Password: `password123`

## Project Structure

```
├── client               # Frontend React application
│   ├── src
│   │   ├── components   # UI components
│   │   ├── hooks        # Custom React hooks
│   │   ├── lib          # Utility functions
│   │   ├── pages        # Page components
│   │   └── ...
├── server               # Backend Express server
│   ├── auth.ts          # Authentication logic
│   ├── routes.ts        # API endpoints
│   ├── storage.ts       # Data storage interface
│   ├── database-storage.ts # PostgreSQL implementation
│   └── ...
├── shared               # Shared code between client and server
│   └── schema.ts        # Database schema and types
└── ...
```

## API Documentation

SalonBook offers a comprehensive REST API for all functionality:

- `/api/user` - Get current user info
- `/api/login`, `/api/register`, `/api/logout` - Authentication endpoints
- `/api/salons` - Browse and filter salons
- `/api/salons/:id` - Get salon details
- `/api/salons/:salonId/services` - Get salon services
- `/api/bookings` - Manage bookings
- `/api/reviews` - Read and post reviews
- `/api/favorites` - Manage favorite salons

## Database Schema

The application uses the following tables:
- `users` - User accounts and profiles
- `salons` - Salon information and details
- `services` - Services offered by salons
- `bookings` - Appointment bookings
- `reviews` - Customer reviews for salons
- `favorites` - User's favorite salons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- UI design inspiration from Airbnb
- Salon images from Unsplash
- Built with [insert your name/organization]