# Frontend Wordings Inventory

Este archivo contiene todos los textos hardcodeados encontrados en el frontend de la aplicación, organizados por secciones y con claves propuestas para su internacionalización.

## 1. Navegación y Header

| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `header.appName` | "Padel Tournament" | Header.tsx |
| `header.nav.tournaments` | "Tournaments" | Header.tsx |
| `header.nav.myEnrollments` | "My Enrollments" | Header.tsx |
| `header.nav.rankings` | "Rankings" | Header.tsx |
| `header.nav.associations` | "Associations" | Header.tsx |
| `header.nav.createTournament` | "Create Tournament" | Header.tsx |
| `header.nav.notifications` | "Notifications" | Header.tsx |
| `header.nav.profile` | "Profile" | Header.tsx |
| `header.button.login` | "Login" | Header.tsx |
| `header.button.logout` | "Logout" | Header.tsx |
| `header.button.register` | "Register" | Header.tsx |
| `header.aria.home` | "Home" | Header.tsx |
| `header.aria.profile` | "Profile" | Header.tsx |
| `header.aria.openMenu` | "Open menu" | Header.tsx |
| `header.aria.closeMenu` | "Close menu" | Header.tsx |

## 2. Footer

| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `footer.appName` | "Padel Tournament" | Footer.tsx |
| `footer.description` | "Manage your padel tournaments, enrollments, and rankings all in one place." | Footer.tsx |
| `footer.section.platform` | "Platform" | Footer.tsx |
| `footer.section.support` | "Support" | Footer.tsx |
| `footer.section.legal` | "Legal" | Footer.tsx |
| `footer.link.tournaments` | "Tournaments" | Footer.tsx |
| `footer.link.rankings` | "Rankings" | Footer.tsx |
| `footer.link.associations` | "Associations" | Footer.tsx |
| `footer.link.helpCenter` | "Help Center" | Footer.tsx |
| `footer.link.contactUs` | "Contact Us" | Footer.tsx |
| `footer.link.faq` | "FAQ" | Footer.tsx |
| `footer.link.privacy` | "Privacy Policy" | Footer.tsx |
| `footer.link.terms` | "Terms of Service" | Footer.tsx |
| `footer.copyright` | "Padel Tournament Management. All rights reserved." | Footer.tsx |

## 3. Autenticación

### Login Form
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `auth.login.title` | "Welcome Back" | LoginForm.tsx |
| `auth.login.description` | "Sign in to your account to continue" | LoginForm.tsx |
| `auth.login.email.label` | "Email" | LoginForm.tsx |
| `auth.login.email.placeholder` | "your.email@example.com" | LoginForm.tsx |
| `auth.login.password.label` | "Password" | LoginForm.tsx |
| `auth.login.password.placeholder` | "Enter your password" | LoginForm.tsx |
| `auth.login.button.submit` | "Sign In" | LoginForm.tsx |
| `auth.login.button.submitting` | "Signing in..." | LoginForm.tsx |
| `auth.login.noAccount` | "Don't have an account?" | LoginForm.tsx |
| `auth.login.signUp` | "Sign up" | LoginForm.tsx |
| `auth.login.error.default` | "Invalid email or password" | LoginForm.tsx |

### Register Form
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `auth.register.title` | "Create Account" | RegisterForm.tsx |
| `auth.register.description` | "Sign up to start playing padel tournaments" | RegisterForm.tsx |
| `auth.register.firstName.label` | "First Name" | RegisterForm.tsx |
| `auth.register.firstName.placeholder` | "John" | RegisterForm.tsx |
| `auth.register.lastName.label` | "Last Name" | RegisterForm.tsx |
| `auth.register.lastName.placeholder` | "Doe" | RegisterForm.tsx |
| `auth.register.email.label` | "Email" | RegisterForm.tsx |
| `auth.register.email.placeholder` | "your.email@example.com" | RegisterForm.tsx |
| `auth.register.password.label` | "Password" | RegisterForm.tsx |
| `auth.register.password.placeholder` | "At least 8 characters" | RegisterForm.tsx |
| `auth.register.phoneNumber.label` | "Phone Number (Optional)" | RegisterForm.tsx |
| `auth.register.phoneNumber.placeholder` | "+1234567890" | RegisterForm.tsx |
| `auth.register.button.submit` | "Create Account" | RegisterForm.tsx |
| `auth.register.button.submitting` | "Creating account..." | RegisterForm.tsx |
| `auth.register.hasAccount` | "Already have an account?" | RegisterForm.tsx |
| `auth.register.signIn` | "Sign in" | RegisterForm.tsx |
| `auth.register.error.default` | "Registration failed. Please try again." | RegisterForm.tsx |

### Player Profile Form
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `auth.profile.title` | "Complete Your Profile" | PlayerProfileForm.tsx |
| `auth.profile.description` | "Tell us more about yourself to get started" | PlayerProfileForm.tsx |
| `auth.profile.phoneNumber.label` | "Phone Number (Optional)" | PlayerProfileForm.tsx |
| `auth.profile.phoneNumber.placeholder` | "+1234567890" | PlayerProfileForm.tsx |
| `auth.profile.gender.label` | "Gender (Optional)" | PlayerProfileForm.tsx |
| `auth.profile.gender.placeholder` | "Select gender" | PlayerProfileForm.tsx |
| `auth.profile.gender.male` | "Male" | PlayerProfileForm.tsx |
| `auth.profile.gender.female` | "Female" | PlayerProfileForm.tsx |
| `auth.profile.gender.other` | "Other" | PlayerProfileForm.tsx |
| `auth.profile.dateOfBirth.label` | "Date of Birth (Optional)" | PlayerProfileForm.tsx |
| `auth.profile.playingHand.label` | "Playing Hand (Optional)" | PlayerProfileForm.tsx |
| `auth.profile.playingHand.placeholder` | "Select playing hand" | PlayerProfileForm.tsx |
| `auth.profile.playingHand.right` | "Right" | PlayerProfileForm.tsx |
| `auth.profile.playingHand.left` | "Left" | PlayerProfileForm.tsx |
| `auth.profile.playingHand.ambidextrous` | "Ambidextrous" | PlayerProfileForm.tsx |
| `auth.profile.playingStyle.label` | "Playing Style (Optional)" | PlayerProfileForm.tsx |
| `auth.profile.playingStyle.placeholder` | "Select playing style" | PlayerProfileForm.tsx |
| `auth.profile.playingStyle.defensive` | "Defensive" | PlayerProfileForm.tsx |
| `auth.profile.playingStyle.offensive` | "Offensive" | PlayerProfileForm.tsx |
| `auth.profile.playingStyle.allAround` | "All Around" | PlayerProfileForm.tsx |
| `auth.profile.button.submit` | "Complete Profile" | PlayerProfileForm.tsx |
| `auth.profile.button.submitting` | "Saving profile..." | PlayerProfileForm.tsx |
| `auth.profile.button.skip` | "Skip for now" | PlayerProfileForm.tsx |
| `auth.profile.error.default` | "Failed to update profile. Please try again." | PlayerProfileForm.tsx |

## 4. Torneos

### Tournament Card
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `tournament.card.capacity` | "Capacity: {maxTeams} teams" | TournamentCard.tsx |
| `tournament.card.format` | "Format:" | TournamentCard.tsx |

### Tournament Form
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `tournament.form.section.basic.title` | "Basic Information" | TournamentForm.tsx |
| `tournament.form.section.basic.description` | "General tournament details" | TournamentForm.tsx |
| `tournament.form.name.label` | "Tournament Name *" | TournamentForm.tsx |
| `tournament.form.name.placeholder` | "Summer Padel Championship 2024" | TournamentForm.tsx |
| `tournament.form.description.label` | "Description" | TournamentForm.tsx |
| `tournament.form.description.placeholder` | "Tournament description..." | TournamentForm.tsx |
| `tournament.form.startDate.label` | "Start Date *" | TournamentForm.tsx |
| `tournament.form.endDate.label` | "End Date" | TournamentForm.tsx |
| `tournament.form.type.label` | "Tournament Type *" | TournamentForm.tsx |
| `tournament.form.type.placeholder` | "Select tournament type" | TournamentForm.tsx |
| `tournament.form.type.singleElimination` | "Single Elimination" | TournamentForm.tsx |
| `tournament.form.type.doubleElimination` | "Double Elimination" | TournamentForm.tsx |
| `tournament.form.type.roundRobin` | "Round Robin" | TournamentForm.tsx |
| `tournament.form.type.groupsKnockout` | "Groups + Knockout" | TournamentForm.tsx |
| `tournament.form.associationId.label` | "Association ID *" | TournamentForm.tsx |
| `tournament.form.associationId.placeholder` | "UUID of the association" | TournamentForm.tsx |
| `tournament.form.isPublic.label` | "Make tournament public" | TournamentForm.tsx |
| `tournament.form.section.settings.title` | "Tournament Settings" | TournamentForm.tsx |
| `tournament.form.section.settings.description` | "Configure tournament parameters" | TournamentForm.tsx |
| `tournament.form.maxTeams.label` | "Max Teams" | TournamentForm.tsx |
| `tournament.form.maxTeams.placeholder` | "32" | TournamentForm.tsx |
| `tournament.form.minTeams.label` | "Min Teams" | TournamentForm.tsx |
| `tournament.form.minTeams.placeholder` | "4" | TournamentForm.tsx |
| `tournament.form.teamSize.label` | "Team Size *" | TournamentForm.tsx |
| `tournament.form.categoryRange.label` | "Category Range" | TournamentForm.tsx |
| `tournament.form.categoryRange.min` | "Min Category" | TournamentForm.tsx |
| `tournament.form.categoryRange.max` | "Max Category" | TournamentForm.tsx |
| `tournament.form.category.label` | "Category {number}" | TournamentForm.tsx |
| `tournament.form.button.create` | "Create Tournament" | TournamentForm.tsx |
| `tournament.form.button.update` | "Update Tournament" | TournamentForm.tsx |
| `tournament.form.button.saving` | "Saving..." | TournamentForm.tsx |
| `tournament.form.error.default` | "Failed to save tournament. Please try again." | TournamentForm.tsx |

### Tournament Status
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `tournament.status.upcoming` | "Próximo" | utils.ts |
| `tournament.status.registrationOpen` | "Inscripción Abierta" | utils.ts |
| `tournament.status.inProgress` | "En Progreso" | utils.ts |
| `tournament.status.completed` | "Completado" | utils.ts |
| `tournament.status.cancelled` | "Cancelado" | utils.ts |

## 5. Inscripciones (Enrollments)

### Enrollment Card
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `enrollment.card.tournament` | "Tournament" | EnrollmentCard.tsx |
| `enrollment.card.tbd` | "TBD" | EnrollmentCard.tsx |
| `enrollment.card.team` | "Team:" | EnrollmentCard.tsx |
| `enrollment.card.category` | "Category:" | EnrollmentCard.tsx |
| `enrollment.card.categoryNumber` | "{number}° Category" | EnrollmentCard.tsx |
| `enrollment.card.status.pending.message` | "Your enrollment is pending approval from the tournament organizer." | EnrollmentCard.tsx |
| `enrollment.card.status.approved.message` | "Your enrollment has been approved! Good luck in the tournament." | EnrollmentCard.tsx |
| `enrollment.card.status.rejected.message` | "Your enrollment was not approved. Please contact the organizer for more information." | EnrollmentCard.tsx |

### Enrollment Form
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `enrollment.form.button.cancel` | "Cancel" | EnrollmentForm.tsx |
| `enrollment.form.button.submit` | "Submit Enrollment" | EnrollmentForm.tsx |
| `enrollment.form.button.submitting` | "Submitting..." | EnrollmentForm.tsx |

### Enrollment Status Badge
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `enrollment.status.pending` | "Pending Approval" | EnrollmentStatusBadge.tsx |
| `enrollment.status.approved` | "Approved" | EnrollmentStatusBadge.tsx |
| `enrollment.status.rejected` | "Rejected" | EnrollmentStatusBadge.tsx |
| `enrollment.status.withdrawn` | "Withdrawn" | EnrollmentStatusBadge.tsx |

## 6. Asociaciones

### Association Card
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `association.card.member` | "Member" | AssociationCard.tsx |
| `association.card.notMember` | "Not a member" | AssociationCard.tsx |
| `association.card.active` | "Active" | AssociationCard.tsx |
| `association.card.inactive` | "Inactive" | AssociationCard.tsx |
| `association.card.pointsSystem` | "Points system configured" | AssociationCard.tsx |

### My Associations
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `association.my.title` | "My Associations" | MyAssociations.tsx |
| `association.my.description` | "Associations you are a member of" | MyAssociations.tsx |
| `association.my.empty.title` | "My Associations" | MyAssociations.tsx |
| `association.my.empty.description` | "You are not a member of any associations yet" | MyAssociations.tsx |
| `association.my.empty.message` | "Browse available associations and request membership to get started" | MyAssociations.tsx |
| `association.my.error` | "Failed to load associations" | MyAssociations.tsx |

## 7. Rankings

### Rankings Table
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `rankings.table.position` | "Position" | RankingsTable.tsx |
| `rankings.table.player` | "Player" | RankingsTable.tsx |
| `rankings.table.points` | "Points" | RankingsTable.tsx |
| `rankings.table.tournaments` | "Tournaments" | RankingsTable.tsx |
| `rankings.table.you` | "You" | RankingsTable.tsx |
| `rankings.position.first` | "🥇 1st" | RankingsTable.tsx |
| `rankings.position.second` | "🥈 2nd" | RankingsTable.tsx |
| `rankings.position.third` | "🥉 3rd" | RankingsTable.tsx |

## 8. Notificaciones

### Notification Item
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `notification.timeAgo.default` | "hace un momento" | NotificationItem.tsx |

## 9. Páginas

### Landing Page
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `landing.hero.title` | "Welcome to Padel Tournament Manager" | LandingPage.tsx |
| `landing.hero.subtitle` | "The complete platform for organizing, participating, and tracking padel tournaments" | LandingPage.tsx |
| `landing.hero.getStarted` | "Get Started" | LandingPage.tsx |
| `landing.hero.signIn` | "Sign In" | LandingPage.tsx |
| `landing.features.title` | "Everything You Need" | LandingPage.tsx |
| `landing.features.tournamentManagement.title` | "Tournament Management" | LandingPage.tsx |
| `landing.features.tournamentManagement.description` | "Create and manage padel tournaments with customizable formats and scoring systems" | LandingPage.tsx |
| `landing.features.teamEnrollment.title` | "Team Enrollment" | LandingPage.tsx |
| `landing.features.teamEnrollment.description` | "Easily enroll with partners and track your tournament participation" | LandingPage.tsx |
| `landing.features.rankings.title` | "Rankings & Statistics" | LandingPage.tsx |
| `landing.features.rankings.description` | "View category-specific rankings and track your performance over time" | LandingPage.tsx |
| `landing.features.schedule.title` | "Schedule & Notifications" | LandingPage.tsx |
| `landing.features.schedule.description` | "Stay updated with match schedules and tournament announcements" | LandingPage.tsx |
| `landing.cta.title` | "Ready to Start Playing?" | LandingPage.tsx |
| `landing.cta.subtitle` | "Join thousands of players and organizers using our platform" | LandingPage.tsx |
| `landing.cta.button` | "Create Your Account" | LandingPage.tsx |

### Not Found Page
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `notFound.title` | "Page Not Found" | NotFoundPage.tsx |
| `notFound.code` | "404" | NotFoundPage.tsx |
| `notFound.heading` | "Page Not Found" | NotFoundPage.tsx |
| `notFound.message` | "The page you are looking for doesn't exist or has been moved." | NotFoundPage.tsx |
| `notFound.button.home` | "Go Home" | NotFoundPage.tsx |
| `notFound.button.back` | "Go Back" | NotFoundPage.tsx |

### Dashboard Page
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `dashboard.welcome` | "Welcome back, {firstName}!" | DashboardPage.tsx |
| `dashboard.subtitle` | "Here's what's happening with your tournaments" | DashboardPage.tsx |
| `dashboard.stats.activeEnrollments` | "Active Enrollments" | DashboardPage.tsx |
| `dashboard.stats.activeEnrollments.empty` | "No active enrollments yet" | DashboardPage.tsx |
| `dashboard.stats.upcomingTournaments` | "Upcoming Tournaments" | DashboardPage.tsx |
| `dashboard.stats.upcomingTournaments.empty` | "Browse tournaments to get started" | DashboardPage.tsx |
| `dashboard.stats.totalPoints` | "Total Points" | DashboardPage.tsx |
| `dashboard.stats.totalPoints.empty` | "Earn points by participating" | DashboardPage.tsx |
| `dashboard.quickActions.title` | "Quick Actions" | DashboardPage.tsx |
| `dashboard.quickActions.browseTournaments.title` | "Browse Tournaments" | DashboardPage.tsx |
| `dashboard.quickActions.browseTournaments.description` | "Find and enroll in upcoming tournaments" | DashboardPage.tsx |
| `dashboard.quickActions.myEnrollments.title` | "My Enrollments" | DashboardPage.tsx |
| `dashboard.quickActions.myEnrollments.description` | "View your tournament enrollments" | DashboardPage.tsx |
| `dashboard.quickActions.rankings.title` | "Rankings" | DashboardPage.tsx |
| `dashboard.quickActions.rankings.description` | "Check your ranking and statistics" | DashboardPage.tsx |
| `dashboard.quickActions.notifications.title` | "Notifications" | DashboardPage.tsx |
| `dashboard.quickActions.notifications.description` | "View your latest notifications" | DashboardPage.tsx |
| `dashboard.quickActions.goTo` | "Go to {title}" | DashboardPage.tsx |
| `dashboard.recentActivity.title` | "Recent Activity" | DashboardPage.tsx |
| `dashboard.recentActivity.empty` | "No recent activity yet. Start by enrolling in a tournament!" | DashboardPage.tsx |

## 10. Componentes Comunes

### Error Boundary
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `error.boundary.title` | "Something went wrong" | ErrorBoundary.tsx |
| `error.boundary.description` | "An unexpected error occurred. Please try refreshing the page." | ErrorBoundary.tsx |
| `error.boundary.button.home` | "Go to Home" | ErrorBoundary.tsx |
| `error.boundary.button.refresh` | "Refresh Page" | ErrorBoundary.tsx |

### Offline Detector
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `offline.message` | "No internet connection" | OfflineDetector.tsx |

### Loading Spinner
| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `loading.default` | "Loading..." | LoadingSpinner.tsx |

## 11. Categorías

| Clave | Texto Actual (ES) | Ubicación |
|-------|------------------|-----------|
| `category.1` | "1ra Categoría" | utils.ts |
| `category.2` | "2da Categoría" | utils.ts |
| `category.3` | "3ra Categoría" | utils.ts |
| `category.4` | "4ta Categoría" | utils.ts |
| `category.5` | "5ta Categoría" | utils.ts |
| `category.6` | "6ta Categoría" | utils.ts |
| `category.7` | "7ma Categoría" | utils.ts |
| `category.8` | "8va Categoría" | utils.ts |
| `category.default` | "Categoría {number}" | utils.ts |

## Notas de Implementación

### Estructura Recomendada para i18n

```typescript
// Ejemplo de estructura de archivo de traducción
export const translations = {
  es: {
    header: {
      appName: "Padel Tournament",
      nav: {
        tournaments: "Torneos",
        myEnrollments: "Mis Inscripciones",
        // ...
      }
    },
    auth: {
      login: {
        title: "Bienvenido",
        // ...
      }
    }
    // ...
  },
  en: {
    header: {
      appName: "Padel Tournament",
      nav: {
        tournaments: "Tournaments",
        myEnrollments: "My Enrollments",
        // ...
      }
    }
    // ...
  }
}
```

### Librerías Recomendadas

1. **react-i18next** - La más popular para React
2. **react-intl** - De FormatJS, muy completa
3. **next-i18next** - Si se migra a Next.js

### Próximos Pasos

1. Elegir librería de i18n
2. Crear archivos de traducción (es.json, en.json, pt.json)
3. Configurar el provider de i18n en la aplicación
4. Reemplazar strings hardcodeados por llamadas a la función de traducción
5. Agregar selector de idioma en el header
6. Persistir preferencia de idioma en localStorage

### Consideraciones Especiales

- **Fechas**: Usar `date-fns` con locales para formateo
- **Números**: Considerar formato de números según región
- **Pluralización**: Manejar casos singulares/plurales
- **Interpolación**: Variables dinámicas en textos (ej: "Welcome back, {firstName}!")
- **Género**: Algunos idiomas requieren ajustes según género
