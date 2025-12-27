# Implementation Plan: Frontend Web Responsive - Padel Tournament Management System

**Date**: December 26, 2025
**Spec**: [specifications/frontend-web-spec.md](specifications/frontend-web-spec.md)

## Summary

Develop a responsive web application for the Padel Tournament Management System that enables players to browse tournaments, enroll with partners, view rankings, and manage their profiles. Organizers can create and manage tournaments, review enrollments, and update tournament status. The application prioritizes mobile-first design, accessibility, and seamless integration with the existing backend API.

**Primary Requirement**: Build a fully responsive React-based web application with authentication, tournament discovery, enrollment management, rankings display, and organizer tools.

**Technical Approach**: Use React 18+ with TypeScript, TailwindCSS for styling, shadcn/ui for components, React Query for server state, and React Router for navigation. Implement mobile-first responsive design with progressive enhancement for tablet and desktop views.

## Technical Context

**Language/Version**: TypeScript 5.3+, React 18+  
**Primary Dependencies**: React, React Router v6, TailwindCSS, shadcn/ui, React Query (TanStack Query), React Hook Form, Zod, Axios, Lucide React  
**Storage**: JWT tokens in httpOnly cookies (preferred) or secure localStorage, React Query cache for API data  
**Testing**: Vitest for unit tests, React Testing Library for component tests, Playwright for E2E tests  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - latest 2 versions), iOS Safari, Android Chrome  
**Project Type**: Web application (SPA with client-side routing)  
**Performance Goals**: <3s initial load on 3G, <1s API responses, <200ms loading indicator delay, 60fps animations  
**Constraints**: WCAG 2.1 Level AA compliance, mobile-first (320px minimum), offline error handling, session management  
**Scale/Scope**: ~15 pages/views, 50+ components, 30+ API endpoints, support for 1000+ concurrent users

## Project Structure

### Documentation (this feature)

```text
specifications/
└── frontend-web-spec.md    # Feature specification

frontend-plan.md            # This file
```

### Source Code (repository root)

```text
frontend/
├── public/
│   ├── favicon.ico
│   └── assets/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   │   ├── auth/            # Authentication components
│   │   ├── tournaments/     # Tournament-related components
│   │   ├── enrollments/     # Enrollment components
│   │   ├── rankings/        # Rankings components
│   │   ├── notifications/   # Notification components
│   │   └── common/          # Shared components (LoadingSpinner, ErrorBoundary)
│   ├── pages/
│   │   ├── public/          # Public pages (Landing, Login, Register)
│   │   ├── player/          # Player pages (Dashboard, Profile, Enrollments)
│   │   ├── organizer/       # Organizer pages (Create, Manage)
│   │   └── shared/          # Shared pages (Tournaments, Rankings)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTournaments.ts
│   │   ├── useEnrollments.ts
│   │   └── useNotifications.ts
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts    # Axios instance
│   │   │   ├── auth.ts
│   │   │   ├── tournaments.ts
│   │   │   ├── enrollments.ts
│   │   │   ├── rankings.ts
│   │   │   └── notifications.ts
│   │   └── storage.ts       # Token storage utilities
│   ├── lib/
│   │   ├── utils.ts         # Utility functions
│   │   ├── validators.ts    # Zod schemas
│   │   └── constants.ts     # App constants
│   ├── types/
│   │   ├── user.ts
│   │   ├── tournament.ts
│   │   ├── enrollment.ts
│   │   └── api.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── routes/
│   │   ├── index.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── OrganizerRoute.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

**Structure Decision**: Web application structure with React SPA. The `frontend/` directory contains all client-side code organized by feature and responsibility. Components are grouped by domain (tournaments, enrollments, rankings) for better maintainability. The `pages/` directory follows the routing structure, while `components/` contains reusable UI elements. API services are centralized in `services/api/` for consistent data fetching patterns.

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETED

**Purpose**: Project initialization and basic structure

- [x] T001 Create frontend project structure with directories per implementation plan
- [x] T002 Initialize React + TypeScript project with Vite
- [x] T003 Install and configure core dependencies (React Router, TailwindCSS, shadcn/ui)
- [x] T004 Configure ESLint, Prettier, and TypeScript strict mode
- [x] T005 Setup TailwindCSS with custom theme (colors, spacing, breakpoints)
- [x] T006 Initialize shadcn/ui and install base components (Button, Input, Card, Dialog)
- [x] T007 Create .env.example with required environment variables
- [x] T008 Setup Vitest and React Testing Library configuration
- [x] T009 Create basic README with setup instructions

**Completion Notes**:
- All base components created: Button, Input, Card, Dialog
- Radix UI dependencies added: @radix-ui/react-slot, @radix-ui/react-dialog, @radix-ui/react-label, @radix-ui/react-select, @radix-ui/react-toast
- Vitest configured with jsdom environment and React Testing Library
- Test utilities created with QueryClient and Router providers
- Sample tests created and passing (21 tests in 2 files)
- TailwindCSS configured with custom padel theme (primary green color)
- Project structure follows specification with organized component directories

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETED

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Create Axios client instance with base URL and interceptors in src/services/api/client.ts
- [x] T011 Implement token storage utilities in src/services/storage.ts (httpOnly cookie support)
- [x] T012 Create AuthContext with login, logout, and user state in src/contexts/AuthContext.tsx
- [x] T013 Implement ProtectedRoute component for authenticated routes in src/routes/ProtectedRoute.tsx
- [x] T014 Implement OrganizerRoute component for organizer-only routes in src/routes/OrganizerRoute.tsx
- [x] T015 Setup React Query provider with default configuration in src/App.tsx
- [x] T016 Create base layout components (Header, Footer, Sidebar) in src/components/layout/
- [x] T017 Implement responsive navigation with mobile hamburger menu
- [x] T018 Create ErrorBoundary component for error handling in src/components/common/ErrorBoundary.tsx
- [x] T019 Create LoadingSpinner component in src/components/common/LoadingSpinner.tsx
- [x] T020 Setup React Router with route configuration in src/routes/index.tsx
- [x] T021 Create TypeScript types for User, Player Profile, and Auth in src/types/
- [x] T022 Implement global error handling and toast notifications
- [x] T023 Create utility functions (formatDate, formatCategory, etc.) in src/lib/utils.ts
- [x] T024 Setup responsive breakpoint utilities and hooks

**Completion Notes**:
- Axios client configured with TypeScript types, interceptors, and 10s timeout
- Token storage utilities with localStorage abstraction
- AuthContext with auto-login on mount, loading state, and updateUser method
- ProtectedRoute and OrganizerRoute with role-based access control
- React Query configured with optimized defaults (5min stale time, no retry on mutations)
- Complete layout system: Header (responsive with mobile menu), Footer, MainLayout
- ErrorBoundary with user-friendly error UI and reset functionality
- LoadingSpinner with 3 sizes (sm, md, lg) and accessible labels
- Router with 15+ routes including public, protected, and organizer routes
- TypeScript types for User, Tournament, Enrollment, API responses
- Toast notification system with Radix UI and custom hook
- Utility functions for formatting dates, categories, statuses
- Zod validation schemas for forms (login, register, profile, tournament, enrollment)
- Responsive hooks: useMediaQuery, useIsMobile, useIsTablet, useIsDesktop
- Tests created for LoadingSpinner component

**Checkpoint**: ✅ Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Authentication and User Onboarding (Priority: P1)

**Goal**: Enable users to register, log in, and set up their player profile to access the platform

**Independent Test**: Register a new user → Log in → Complete player profile → Verify dashboard access. User can create account and access basic functionality.

### Tests for User Story 1

- [ ] T025 [P] [US1] Unit tests for auth API service functions in tests/unit/services/auth.test.ts
- [ ] T026 [P] [US1] Component tests for Login form in tests/unit/components/auth/LoginForm.test.tsx
- [ ] T027 [P] [US1] Component tests for Register form in tests/unit/components/auth/RegisterForm.test.tsx
- [ ] T028 [P] [US1] E2E test for complete registration and login flow in tests/e2e/auth.spec.ts

### Implementation for User Story 1

- [ ] T029 [P] [US1] Create User and PlayerProfile TypeScript types in src/types/user.ts
- [ ] T030 [P] [US1] Create auth API service with register, login, getProfile in src/services/api/auth.ts
- [ ] T031 [P] [US1] Create Zod validation schemas for login and register forms in src/lib/validators.ts
- [ ] T032 [US1] Implement LoginForm component with React Hook Form in src/components/auth/LoginForm.tsx
- [ ] T033 [US1] Implement RegisterForm component with validation in src/components/auth/RegisterForm.tsx
- [ ] T034 [US1] Create Login page in src/pages/public/LoginPage.tsx
- [ ] T035 [US1] Create Register page in src/pages/public/RegisterPage.tsx
- [ ] T036 [US1] Create Landing page with hero and CTAs in src/pages/public/LandingPage.tsx
- [ ] T037 [US1] Implement PlayerProfileForm component in src/components/auth/PlayerProfileForm.tsx
- [ ] T038 [US1] Create Profile Setup page for first-time users in src/pages/player/ProfileSetupPage.tsx
- [ ] T039 [US1] Create Dashboard page with overview in src/pages/player/DashboardPage.tsx
- [ ] T040 [US1] Implement profile picture upload with validation
- [ ] T041 [US1] Add responsive styling for all auth pages (mobile-first)
- [ ] T042 [US1] Implement session persistence and auto-login
- [ ] T043 [US1] Add loading states and error handling for auth flows

**Checkpoint**: Users can register, log in, complete profile, and access dashboard

---

## Phase 4: User Story 2 - Browse and View Tournaments (Priority: P1)

**Goal**: Enable players to discover tournaments through browsing, filtering, and viewing detailed information

**Independent Test**: Browse tournament list → Apply filters (status, category) → Search by name → View tournament details. User can discover relevant tournaments.

### Tests for User Story 2

- [ ] T044 [P] [US2] Unit tests for tournaments API service in tests/unit/services/tournaments.test.ts
- [ ] T045 [P] [US2] Component tests for TournamentCard in tests/unit/components/tournaments/TournamentCard.test.tsx
- [ ] T046 [P] [US2] Component tests for TournamentFilters in tests/unit/components/tournaments/TournamentFilters.test.tsx
- [ ] T047 [P] [US2] E2E test for tournament browsing and filtering in tests/e2e/tournaments.spec.ts

### Implementation for User Story 2

- [ ] T048 [P] [US2] Create Tournament TypeScript types in src/types/tournament.ts
- [ ] T049 [P] [US2] Create tournaments API service with list, getById, filters in src/services/api/tournaments.ts
- [ ] T050 [US2] Create useTournaments custom hook with React Query in src/hooks/useTournaments.ts
- [ ] T051 [US2] Implement TournamentCard component with responsive design in src/components/tournaments/TournamentCard.tsx
- [ ] T052 [US2] Implement TournamentFilters component (status, category) in src/components/tournaments/TournamentFilters.tsx
- [ ] T053 [US2] Implement TournamentSearch component in src/components/tournaments/TournamentSearch.tsx
- [ ] T054 [US2] Create TournamentsList page with pagination in src/pages/shared/TournamentsListPage.tsx
- [ ] T055 [US2] Implement TournamentDetails component with all info in src/components/tournaments/TournamentDetails.tsx
- [ ] T056 [US2] Create TournamentDetailsPage in src/pages/shared/TournamentDetailsPage.tsx
- [ ] T057 [US2] Add skeleton loaders for tournament cards
- [ ] T058 [US2] Implement pagination controls with page navigation
- [ ] T059 [US2] Add responsive grid layout for tournament cards (1/2/3 columns)
- [ ] T060 [US2] Implement empty state when no tournaments match filters
- [ ] T061 [US2] Add tournament capacity display when visible

**Checkpoint**: Users can browse, filter, search, and view tournament details

---

## Phase 5: User Story 3 - Tournament Enrollment (Priority: P1)

**Goal**: Enable players to enroll in tournaments with partners and track enrollment status

**Independent Test**: View tournament → Click enroll → Select partner → Submit → View enrollment status. User can participate in tournaments.

### Tests for User Story 3

- [ ] T062 [P] [US3] Unit tests for enrollments API service in tests/unit/services/enrollments.test.ts
- [ ] T063 [P] [US3] Component tests for EnrollmentForm in tests/unit/components/enrollments/EnrollmentForm.test.tsx
- [ ] T064 [P] [US3] E2E test for complete enrollment flow in tests/e2e/enrollments.spec.ts

### Implementation for User Story 3

- [ ] T065 [P] [US3] Create Enrollment TypeScript types in src/types/enrollment.ts
- [ ] T066 [P] [US3] Create enrollments API service in src/services/api/enrollments.ts
- [ ] T067 [US3] Create useEnrollments custom hook in src/hooks/useEnrollments.ts
- [ ] T068 [US3] Implement PartnerSelector component with search in src/components/enrollments/PartnerSelector.tsx
- [ ] T069 [US3] Implement EnrollmentForm component in src/components/enrollments/EnrollmentForm.tsx
- [ ] T070 [US3] Create EnrollmentDialog modal component in src/components/enrollments/EnrollmentDialog.tsx
- [ ] T071 [US3] Add enroll button to TournamentDetailsPage with modal trigger
- [ ] T072 [US3] Implement EnrollmentStatusBadge component in src/components/enrollments/EnrollmentStatusBadge.tsx
- [ ] T073 [US3] Create MyEnrollmentsPage in src/pages/player/MyEnrollmentsPage.tsx
- [ ] T074 [US3] Implement EnrollmentCard component with status in src/components/enrollments/EnrollmentCard.tsx
- [ ] T075 [US3] Add enrollment validation (tournament capacity, duplicate check)
- [ ] T076 [US3] Implement optimistic updates for enrollment submission
- [ ] T077 [US3] Add loading states and error handling for enrollment flow
- [ ] T078 [US3] Disable enroll button when tournament is full
- [ ] T079 [US3] Add responsive styling for enrollment components

**Checkpoint**: Users can enroll in tournaments with partners and view enrollment status

---

## Phase 6: User Story 4 - View Rankings and Statistics (Priority: P2)

**Goal**: Enable players to view rankings, personal statistics, and tournament history for performance tracking

**Independent Test**: View rankings → Filter by category → View personal statistics → Check ranking position. User can track performance.

### Tests for User Story 4

- [ ] T080 [P] [US4] Unit tests for rankings API service in tests/unit/services/rankings.test.ts
- [ ] T081 [P] [US4] Component tests for RankingsTable in tests/unit/components/rankings/RankingsTable.test.tsx
- [ ] T082 [P] [US4] E2E test for viewing rankings and statistics in tests/e2e/rankings.spec.ts

### Implementation for User Story 4

- [ ] T083 [P] [US4] Create Ranking and Statistics TypeScript types in src/types/ranking.ts
- [ ] T084 [P] [US4] Create rankings API service in src/services/api/rankings.ts
- [ ] T085 [US4] Create useRankings custom hook in src/hooks/useRankings.ts
- [ ] T086 [US4] Implement RankingsTable component with pagination in src/components/rankings/RankingsTable.tsx
- [ ] T087 [US4] Implement CategoryFilter component in src/components/rankings/CategoryFilter.tsx
- [ ] T088 [US4] Create RankingsPage in src/pages/shared/RankingsPage.tsx
- [ ] T089 [US4] Implement PlayerStatistics component in src/components/rankings/PlayerStatistics.tsx
- [ ] T090 [US4] Implement TournamentStatistics component in src/components/rankings/TournamentStatistics.tsx
- [ ] T091 [US4] Add statistics section to ProfilePage in src/pages/player/ProfilePage.tsx
- [ ] T092 [US4] Implement StatCard component for displaying metrics in src/components/common/StatCard.tsx
- [ ] T093 [US4] Add responsive table design for mobile (card view)
- [ ] T094 [US4] Implement ranking position highlighting for current user
- [ ] T095 [US4] Add empty state when no rankings available

**Checkpoint**: Users can view rankings, statistics, and track their performance

---

## Phase 7: User Story 5 - Tournament Management (Organizer) (Priority: P2)

**Goal**: Enable organizers to create tournaments, manage enrollments, and update tournament progress

**Independent Test**: Create tournament → Review enrollments → Approve/reject → Update status. Organizer can manage competitions.

### Tests for User Story 5

- [ ] T096 [P] [US5] Unit tests for tournament creation and management in tests/unit/services/tournaments.test.ts
- [ ] T097 [P] [US5] Component tests for TournamentForm in tests/unit/components/organizer/TournamentForm.test.tsx
- [ ] T098 [P] [US5] E2E test for tournament creation and management in tests/e2e/organizer.spec.ts

### Implementation for User Story 5

- [ ] T099 [P] [US5] Create tournament creation/update API methods in src/services/api/tournaments.ts
- [ ] T100 [P] [US5] Create Zod validation schema for tournament form in src/lib/validators.ts
- [ ] T101 [US5] Implement TournamentForm component with all fields in src/components/organizer/TournamentForm.tsx
- [ ] T102 [US5] Create CreateTournamentPage in src/pages/organizer/CreateTournamentPage.tsx
- [ ] T103 [US5] Create EditTournamentPage in src/pages/organizer/EditTournamentPage.tsx
- [ ] T104 [US5] Implement EnrollmentRequestCard component in src/components/organizer/EnrollmentRequestCard.tsx
- [ ] T105 [US5] Create ManageEnrollmentsPage in src/pages/organizer/ManageEnrollmentsPage.tsx
- [ ] T106 [US5] Implement approve/reject enrollment actions with confirmation
- [ ] T107 [US5] Implement TournamentStatusSelector component in src/components/organizer/TournamentStatusSelector.tsx
- [ ] T108 [US5] Create ManageTournamentPage with tabs in src/pages/organizer/ManageTournamentPage.tsx
- [ ] T109 [US5] Implement ParticipantsList component in src/components/organizer/ParticipantsList.tsx
- [ ] T110 [US5] Add form validation and error handling for tournament creation
- [ ] T111 [US5] Implement optimistic updates for enrollment approval/rejection
- [ ] T112 [US5] Add responsive styling for organizer pages
- [ ] T113 [US5] Implement organizer dashboard with tournament overview

**Checkpoint**: Organizers can create, manage tournaments, and process enrollments

---

## Phase 8: User Story 6 - Notifications and Real-time Updates (Priority: P3)

**Goal**: Enable users to receive notifications about enrollment status, tournament updates, and important events

**Independent Test**: Trigger event → Receive notification → View notification list → Mark as read. User stays informed.

### Tests for User Story 6

- [ ] T114 [P] [US6] Unit tests for notifications API service in tests/unit/services/notifications.test.ts
- [ ] T115 [P] [US6] Component tests for NotificationBell in tests/unit/components/notifications/NotificationBell.test.tsx
- [ ] T116 [P] [US6] E2E test for notification flow in tests/e2e/notifications.spec.ts

### Implementation for User Story 6

- [ ] T117 [P] [US6] Create Notification TypeScript types in src/types/notification.ts
- [ ] T118 [P] [US6] Create notifications API service in src/services/api/notifications.ts
- [ ] T119 [US6] Create useNotifications custom hook with polling in src/hooks/useNotifications.ts
- [ ] T120 [US6] Implement NotificationBell component with badge in src/components/notifications/NotificationBell.tsx
- [ ] T121 [US6] Implement NotificationDropdown component in src/components/notifications/NotificationDropdown.tsx
- [ ] T122 [US6] Implement NotificationItem component in src/components/notifications/NotificationItem.tsx
- [ ] T123 [US6] Create NotificationsPage with full list in src/pages/player/NotificationsPage.tsx
- [ ] T124 [US6] Add notification bell to Header component
- [ ] T125 [US6] Implement mark as read functionality
- [ ] T126 [US6] Implement mark all as read functionality
- [ ] T127 [US6] Add notification polling (every 30 seconds)
- [ ] T128 [US6] Add empty state when no notifications
- [ ] T129 [US6] Add responsive styling for notification components

**Checkpoint**: Users receive and can manage notifications

---

## Phase 9: User Story 7 - Association Management (Priority: P3)

**Goal**: Enable players to view associations, request membership, and manage categories in different associations

**Independent Test**: Browse associations → Request membership → View memberships → Update category. User can participate in multiple organizations.

### Tests for User Story 7

- [ ] T130 [P] [US7] Unit tests for associations API service in tests/unit/services/associations.test.ts
- [ ] T131 [P] [US7] Component tests for AssociationCard in tests/unit/components/associations/AssociationCard.test.tsx
- [ ] T132 [P] [US7] E2E test for association membership flow in tests/e2e/associations.spec.ts

### Implementation for User Story 7

- [ ] T133 [P] [US7] Create Association TypeScript types in src/types/association.ts
- [ ] T134 [P] [US7] Create associations API service in src/services/api/associations.ts
- [ ] T135 [US7] Create useAssociations custom hook in src/hooks/useAssociations.ts
- [ ] T136 [US7] Implement AssociationCard component in src/components/associations/AssociationCard.tsx
- [ ] T137 [US7] Create AssociationsListPage in src/pages/shared/AssociationsListPage.tsx
- [ ] T138 [US7] Create AssociationDetailsPage in src/pages/shared/AssociationDetailsPage.tsx
- [ ] T139 [US7] Implement MembershipRequestButton component in src/components/associations/MembershipRequestButton.tsx
- [ ] T140 [US7] Implement MyAssociations component in src/components/associations/MyAssociations.tsx
- [ ] T141 [US7] Add associations section to ProfilePage
- [ ] T142 [US7] Implement CategoryUpdateDialog component in src/components/associations/CategoryUpdateDialog.tsx
- [ ] T143 [US7] Add responsive styling for association components
- [ ] T144 [US7] Add empty state when no associations available

**Checkpoint**: Users can browse associations, request membership, and manage categories

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T145 Add comprehensive accessibility testing and fixes (WCAG 2.1 AA)
- [ ] T146 Implement keyboard navigation for all interactive elements
- [ ] T147 Add focus states and ARIA labels throughout application
- [ ] T148 Optimize images with lazy loading and WebP format
- [ ] T149 Implement code splitting for route-based chunks
- [ ] T150 Add performance monitoring and optimization
- [ ] T151 Implement proper SEO meta tags for all pages
- [ ] T152 Add comprehensive error boundaries for all major sections
- [ ] T153 Implement offline detection and user feedback
- [ ] T154 Add loading skeletons for all data-fetching components
- [ ] T155 Implement form data persistence on errors
- [ ] T156 Add comprehensive unit test coverage (>80%)
- [ ] T157 Add integration tests for critical user flows
- [ ] T158 Complete E2E test suite with Playwright
- [ ] T159 Setup CI/CD pipeline with automated testing
- [ ] T160 Create deployment configuration for Vercel/Netlify
- [ ] T161 Write comprehensive README with setup and deployment instructions
- [ ] T162 Document component library and usage patterns
- [ ] T163 Perform security audit and fixes
- [ ] T164 Optimize bundle size and remove unused dependencies
- [ ] T165 Add analytics tracking for key user actions
- [ ] T166 Implement proper logging for debugging
- [ ] T167 Final responsive design testing on real devices
- [ ] T168 Cross-browser compatibility testing
- [ ] T169 Performance testing and optimization
- [ ] T170 User acceptance testing with stakeholders

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - US1 (Authentication) must complete before other user stories (provides auth context)
  - US2 (Browse Tournaments) can start after US1
  - US3 (Enrollment) depends on US1 and US2 (needs auth and tournament viewing)
  - US4 (Rankings) can start after US1 (independent of tournaments)
  - US5 (Organizer) depends on US1 and US2 (needs auth and tournament structure)
  - US6 (Notifications) can start after US1 (needs auth context)
  - US7 (Associations) can start after US1 (independent feature)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: MUST complete first - provides authentication foundation for all other features
- **User Story 2 (P1)**: Can start after US1 - provides tournament discovery
- **User Story 3 (P1)**: Depends on US1 and US2 - needs auth and tournament viewing
- **User Story 4 (P2)**: Can start after US1 - independent of tournament features
- **User Story 5 (P2)**: Depends on US1 and US2 - needs auth and tournament structure
- **User Story 6 (P3)**: Can start after US1 - independent feature
- **User Story 7 (P3)**: Can start after US1 - independent feature

### Within Each User Story

1. Create TypeScript types first
2. Implement API services
3. Create custom hooks with React Query
4. Build UI components (atomic → composite)
5. Create pages that compose components
6. Add responsive styling
7. Implement error handling and loading states
8. Write tests (unit → integration → E2E)

### Critical Path

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3 (US1: Auth) → 
Phase 4 (US2: Browse) → Phase 5 (US3: Enrollment) → 
Phase 6-9 (US4-7: Parallel) → Phase 10 (Polish)
```

## Notes

- [P] label indicates tasks with tests that should be written first (TDD approach)
- [US#] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests pass before moving to next task
- Commit after each task or logical group of related tasks
- Stop at any checkpoint to validate story independently
- Use feature branches for each user story
- Mobile-first approach: design and test on mobile first, then scale up
- Accessibility is not optional - test with screen readers and keyboard navigation
- Performance budget: monitor bundle size and loading times
- Keep components small and focused (Single Responsibility Principle)
- Use TypeScript strictly - no `any` types without justification
- Follow React best practices: hooks, composition, controlled components
- API integration: handle loading, error, and success states consistently
- Form validation: client-side with Zod, display errors inline
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Use React Query for all server state - avoid duplicating data in local state
- Implement optimistic updates for better UX where appropriate
- Always provide loading indicators for async operations
- Handle edge cases: empty states, errors, network failures, session expiration
