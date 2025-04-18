# SalonBook - Salon & Spa Booking Platform

SalonBook is a modern, Airbnb-inspired salon and spa booking platform designed for Morocco. The platform connects customers with beauty and wellness services in an elegant, intuitive interface.

![SalonBook Screenshot](generated-icon.png)

## Features

### For Customers
- **Discover Salons**: Browse salons by location, category, and ratings
- **Book Services**: Select services and book appointments with real-time availability
- **User Profiles**: Manage personal information and view booking history
- **Reviews System**: Leave and read authentic reviews
- **Favorites**: Save favorite salons for quick access

### For Salon Owners
- **Business Dashboard**: Comprehensive overview of bookings and services
- **Service Management**: Add, edit, and manage service offerings
- **Booking Management**: Accept, reschedule, or cancel appointments
- **Business Profile**: Create and update salon profile with images and details
- **Performance Analytics**: Track booking metrics and revenue (coming soon)

## Technology Stack

- **Frontend**: React with TypeScript, TailwindCSS, ShadcnUI
- **Backend**: Express.js (Node.js)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter for lightweight page routing

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
Create a `.env` file in the root directory with the following:
```
DATABASE_URL=postgresql://username:password@localhost:5432/salonbook
SESSION_SECRET=your_secure_session_secret
```

4. Set up the database
```bash
npm run db:push
```

5. Start the application
```bash
npm run dev
```

## Test Accounts

For testing purposes, you can use the following accounts:

**Regular User:**
- Username: `testuser`
- Password: `password123`

**Salon Owner:**
- Username: `salonowner`
- Password: `password123`

## Project Structure

```
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
│   └── index.html          # HTML entry point
├── server/                 # Backend application
│   ├── db.ts               # Database connection
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data storage interface
│   └── index.ts            # Server entry point
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Database schema and types
└── drizzle.config.ts       # Drizzle ORM configuration
```

## API Documentation

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user data

### Salons
- `GET /api/salons` - Get all salons with filters
- `GET /api/salons/:id` - Get salon details
- `POST /api/salons` - Create new salon (owner only)
- `PUT /api/salons/:id` - Update salon (owner only)

### Services
- `GET /api/salons/:id/services` - Get salon services
- `POST /api/services` - Create new service (owner only)
- `PUT /api/services/:id` - Update service (owner only)
- `DELETE /api/services/:id` - Delete service (owner only)

### Bookings
- `GET /api/user/bookings` - Get user bookings
- `GET /api/salon/bookings` - Get salon bookings (owner only)
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id/status` - Update booking status (owner only)

## Database Schema

The application uses the following main data models:

- **User**: Customer and salon owner accounts
- **Salon**: Business information and details
- **Service**: Services offered by salons
- **Booking**: Appointment scheduling
- **Review**: Customer feedback
- **Favorite**: User-saved salons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [ShadcnUI](https://ui.shadcn.com/) - UI components
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [React](https://reactjs.org/) - Frontend library
- [Express.js](https://expressjs.com/) - Backend framework
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) - Database ORM
- [TanStack Query](https://tanstack.com/query) - Data fetching library