# Padel Tournament Management System - Frontend

A responsive web application for managing padel tournaments, enrollments, and rankings.

## Tech Stack

- **React 18+** with TypeScript
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **React Router v6** - Client-side routing
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icon library

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # React components organized by feature
│   │   ├── ui/         # shadcn/ui components
│   │   ├── layout/     # Layout components (Header, Footer, Sidebar)
│   │   ├── auth/       # Authentication components
│   │   ├── tournaments/# Tournament-related components
│   │   ├── enrollments/# Enrollment components
│   │   ├── rankings/   # Rankings components
│   │   ├── notifications/# Notification components
│   │   ├── associations/# Association components
│   │   └── common/     # Shared components
│   ├── pages/          # Page components
│   │   ├── public/     # Public pages (Landing, Login, Register)
│   │   ├── player/     # Player pages
│   │   ├── organizer/  # Organizer pages
│   │   └── shared/     # Shared pages
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services and utilities
│   │   └── api/        # API client and endpoints
│   ├── lib/            # Utility functions and constants
│   ├── types/          # TypeScript type definitions
│   ├── contexts/       # React contexts
│   ├── routes/         # Route configuration
│   └── styles/         # Global styles
├── tests/              # Test files
│   ├── unit/          # Unit tests
│   ├── integration/   # Integration tests
│   └── e2e/           # End-to-end tests
└── ...config files
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on `http://localhost:3001`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL if different from default:
```
VITE_API_BASE_URL=http://localhost:3001/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:ui` - Run tests with UI
- `npm run test:e2e` - Run end-to-end tests

## Features

### Phase 1: Authentication (P1)
- User registration and login
- Player profile setup
- Session management

### Phase 2: Tournament Discovery (P1)
- Browse tournaments
- Filter by status and category
- Search by name
- View tournament details

### Phase 3: Enrollment (P1)
- Enroll in tournaments with partners
- Partner selection and search
- View enrollment status
- Track enrollment history

### Phase 4: Rankings & Statistics (P2)
- View category-specific rankings
- Personal statistics
- Tournament history
- Performance tracking

### Phase 5: Tournament Management (P2)
- Create tournaments (organizers)
- Manage enrollments
- Update tournament status
- View participants

### Phase 6: Notifications (P3)
- Real-time notifications
- Enrollment status updates
- Tournament updates

### Phase 7: Associations (P3)
- Browse associations
- Request membership
- Manage categories

## Development Guidelines

### Code Style

- Use TypeScript strictly - avoid `any` types
- Follow React best practices (hooks, composition)
- Keep components small and focused
- Use functional components with hooks

### State Management

- Use React Query for server state
- Use Context API or Zustand for client state
- Avoid duplicating server data in local state

### Forms

- Use React Hook Form for form handling
- Validate with Zod schemas
- Display inline error messages

### Styling

- Mobile-first approach
- Use TailwindCSS utility classes
- Follow design system tokens
- Ensure WCAG 2.1 Level AA compliance

### API Integration

- Use the centralized API client
- Handle loading, error, and success states
- Implement optimistic updates where appropriate

## Testing

### Unit Tests
```bash
npm test
```

### E2E Tests
```bash
npm run test:e2e
```

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- iOS Safari (latest 2 versions)
- Android Chrome (latest 2 versions)

## Responsive Breakpoints

- Mobile: 320px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px - 1279px
- Large Desktop: 1280px+

## Contributing

1. Create a feature branch from `main`
2. Follow the coding guidelines
3. Write tests for new features
4. Ensure all tests pass
5. Submit a pull request

## License

Private - All rights reserved
