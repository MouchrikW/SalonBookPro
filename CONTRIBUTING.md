# Contributing to SalonBook

Thank you for considering contributing to SalonBook! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

Bug reports help us improve SalonBook. To report a bug:

1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating an issue
3. **Include detailed information**:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Features

We love new ideas! To suggest a feature:

1. **Check existing issues** to avoid duplicates
2. **Use the feature request template** when creating an issue
3. **Be specific** about the problem your feature solves
4. **Provide examples** of how the feature would work

### Pull Requests

We welcome pull requests for bug fixes and new features:

1. **Fork the repository**
2. **Create a branch** for your changes
3. **Write or update tests** if needed
4. **Ensure your code passes all tests**
5. **Update documentation** to reflect your changes
6. **Submit a pull request**

## Development Setup

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Local Development

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

5. Start the application in development mode
```bash
npm run dev
```

## Coding Guidelines

### General

- Follow the existing code style
- Use meaningful variable and function names
- Write comments for complex logic
- Keep functions small and focused

### JavaScript/TypeScript

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Use async/await over Promises where possible
- Prefer functional programming patterns

### React Components

- Use functional components with hooks
- Separate business logic from UI components
- Follow the React Query patterns for data fetching
- Use Tailwind CSS for styling

### Database

- Always update the schema in `shared/schema.ts`
- Avoid direct SQL queries, use Drizzle ORM
- Create migration scripts for database changes
- Consider indexing for frequently queried fields

## Testing

- Write tests for new features and bug fixes
- Run tests before submitting a pull request
- Aim for good test coverage

## Documentation

- Update README.md with new features
- Document API endpoints
- Add inline code comments
- Update the wiki if applicable

## Release Process

- Semantic versioning is used
- Release notes are created for each version
- Deployment is handled by the maintainers

## Questions?

If you have any questions, feel free to:

- Open an issue
- Contact the maintainers
- Join our community chat

Thank you for contributing to SalonBook!