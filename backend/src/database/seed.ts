import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole, Gender } from '../users/entities/user.entity.js';
import { Association } from '../associations/entities/association.entity.js';
import { AssociationMembership } from '../associations/entities/association-membership.entity.js';
import { Category, CategoryLevel } from '../categories/entities/category.entity.js';
import { Tournament, TournamentStatus, TournamentType } from '../tournaments/entities/tournament.entity.js';
import { TournamentTeam } from '../tournaments/entities/tournament-team.entity.js';
import { TournamentPlayer } from '../tournaments/entities/tournament-player.entity.js';
import { TournamentRegistration } from '../tournaments/entities/tournament-registration.entity.js';
import { TournamentMatch } from '../tournaments/entities/tournament-match.entity.js';
import { Season } from '../rankings/entities/season.entity.js';
import { Notification, NotificationType, NotificationStatus } from '../notifications/entities/notification.entity.js';

async function seed() {
  const configService = new ConfigService();
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: +configService.get<number>('DATABASE_PORT', 5432),
    username: configService.get('DATABASE_USERNAME', 'postgres'),
    password: configService.get('DATABASE_PASSWORD', 'agusjgdf10'),
    database: configService.get('DATABASE_NAME', 'padel_tournament'),
    entities: [
      User,
      Association,
      AssociationMembership,
      Category,
      Tournament,
      TournamentTeam,
      TournamentPlayer,
      TournamentRegistration,
      TournamentMatch,
      Season,
      Notification,
    ],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Limpiar datos existentes (en orden inverso por las relaciones)
    console.log('🗑️  Limpiando datos existentes...');
    await dataSource.getRepository(Notification).delete({});
    await dataSource.getRepository(TournamentMatch).delete({});
    await dataSource.getRepository(TournamentRegistration).delete({});
    await dataSource.getRepository(TournamentPlayer).delete({});
    await dataSource.getRepository(TournamentTeam).delete({});
    await dataSource.getRepository(Tournament).delete({});
    await dataSource.getRepository(Season).delete({});
    await dataSource.getRepository(Category).delete({});
    await dataSource.getRepository(AssociationMembership).delete({});
    await dataSource.getRepository(Association).delete({});
    await dataSource.getRepository(User).delete({});

    // 1. Crear Usuarios
    console.log('👥 Creando usuarios...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await dataSource.getRepository(User).save([
      {
        email: 'admin@padel.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Sistema',
        role: UserRole.ADMIN,
        gender: Gender.MALE,
        phoneNumber: '+54 11 1234-5678',
        dateOfBirth: new Date('1985-05-15'),
        playingHand: 'right',
        playingStyle: 'all_around',
        isVerified: true,
      },
      {
        email: 'juan.perez@email.com',
        password: hashedPassword,
        firstName: 'Juan',
        lastName: 'Pérez',
        role: UserRole.ORGANIZER,
        gender: Gender.MALE,
        phoneNumber: '+54 11 2345-6789',
        dateOfBirth: new Date('1990-03-20'),
        playingHand: 'right',
        playingStyle: 'offensive',
        isVerified: true,
      },
      {
        email: 'maria.garcia@email.com',
        password: hashedPassword,
        firstName: 'María',
        lastName: 'García',
        role: UserRole.USER,
        gender: Gender.FEMALE,
        phoneNumber: '+54 11 3456-7890',
        dateOfBirth: new Date('1992-07-10'),
        playingHand: 'left',
        playingStyle: 'defensive',
        isVerified: true,
      },
      {
        email: 'carlos.rodriguez@email.com',
        password: hashedPassword,
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        role: UserRole.USER,
        gender: Gender.MALE,
        phoneNumber: '+54 11 4567-8901',
        dateOfBirth: new Date('1988-11-25'),
        playingHand: 'right',
        playingStyle: 'all_around',
        isVerified: true,
      },
      {
        email: 'ana.martinez@email.com',
        password: hashedPassword,
        firstName: 'Ana',
        lastName: 'Martínez',
        role: UserRole.USER,
        gender: Gender.FEMALE,
        phoneNumber: '+54 11 5678-9012',
        dateOfBirth: new Date('1995-02-14'),
        playingHand: 'right',
        playingStyle: 'offensive',
        isVerified: true,
      },
      {
        email: 'pedro.lopez@email.com',
        password: hashedPassword,
        firstName: 'Pedro',
        lastName: 'López',
        role: UserRole.USER,
        gender: Gender.MALE,
        phoneNumber: '+54 11 6789-0123',
        dateOfBirth: new Date('1991-09-05'),
        playingHand: 'left',
        playingStyle: 'defensive',
        isVerified: true,
      },
      {
        email: 'laura.fernandez@email.com',
        password: hashedPassword,
        firstName: 'Laura',
        lastName: 'Fernández',
        role: UserRole.USER,
        gender: Gender.FEMALE,
        phoneNumber: '+54 11 7890-1234',
        dateOfBirth: new Date('1993-06-18'),
        playingHand: 'right',
        playingStyle: 'all_around',
        isVerified: true,
      },
      {
        email: 'diego.sanchez@email.com',
        password: hashedPassword,
        firstName: 'Diego',
        lastName: 'Sánchez',
        role: UserRole.USER,
        gender: Gender.MALE,
        phoneNumber: '+54 11 8901-2345',
        dateOfBirth: new Date('1989-12-30'),
        playingHand: 'right',
        playingStyle: 'offensive',
        isVerified: true,
      },
    ]);
    console.log(`✅ ${users.length} usuarios creados`);

    // 2. Crear Asociaciones
    console.log('🏢 Creando asociaciones...');
    const associations = await dataSource.getRepository(Association).save([
      {
        name: 'Asociación de Pádel de Buenos Aires',
        description: 'Principal asociación de pádel de la Ciudad de Buenos Aires',
        logoUrl: 'https://example.com/logos/apba.png',
        website: 'https://apba.com.ar',
        isActive: true,
        pointsByRound: {
          'final': 100,
          'semifinal': 75,
          'cuartos': 50,
          'octavos': 25,
          'primera_ronda': 10,
        },
      },
      {
        name: 'Club Náutico San Isidro',
        description: 'Club deportivo con canchas de pádel de primer nivel',
        logoUrl: 'https://example.com/logos/cnsi.png',
        website: 'https://cnsi.com.ar',
        isActive: true,
        pointsByRound: {
          'final': 80,
          'semifinal': 60,
          'cuartos': 40,
          'octavos': 20,
        },
      },
      {
        name: 'Federación Argentina de Pádel',
        description: 'Federación nacional que regula el pádel en Argentina',
        logoUrl: 'https://example.com/logos/fap.png',
        website: 'https://fap.org.ar',
        isActive: true,
        pointsByRound: {
          'final': 150,
          'semifinal': 100,
          'cuartos': 75,
          'octavos': 50,
          'primera_ronda': 25,
        },
      },
    ]);
    console.log(`✅ ${associations.length} asociaciones creadas`);

    // 3. Crear Membresías
    console.log('👤 Creando membresías...');
    const memberships = await dataSource.getRepository(AssociationMembership).save([
      {
        userId: users[0].id,
        associationId: associations[0].id,
        role: 'admin',
        category: 1,
        points: 500,
      },
      {
        userId: users[1].id,
        associationId: associations[0].id,
        role: 'organizer',
        category: 2,
        points: 350,
      },
      {
        userId: users[2].id,
        associationId: associations[0].id,
        role: 'member',
        category: 3,
        points: 280,
      },
      {
        userId: users[3].id,
        associationId: associations[0].id,
        role: 'member',
        category: 2,
        points: 420,
      },
      {
        userId: users[4].id,
        associationId: associations[1].id,
        role: 'member',
        category: 4,
        points: 180,
      },
      {
        userId: users[5].id,
        associationId: associations[1].id,
        role: 'member',
        category: 3,
        points: 310,
      },
      {
        userId: users[6].id,
        associationId: associations[2].id,
        role: 'member',
        category: 2,
        points: 390,
      },
      {
        userId: users[7].id,
        associationId: associations[2].id,
        role: 'member',
        category: 1,
        points: 550,
      },
    ]);
    console.log(`✅ ${memberships.length} membresías creadas`);

    // 4. Crear Categorías
    console.log('🏆 Creando categorías...');
    const categories = await dataSource.getRepository(Category).save([
      {
        name: 'Primera',
        level: CategoryLevel.PROFESSIONAL,
        minPoints: 500,
        maxPoints: 1000,
        description: 'Categoría profesional de máximo nivel',
        isActive: true,
        associationId: associations[0].id,
      },
      {
        name: 'Segunda',
        level: CategoryLevel.ADVANCED,
        minPoints: 300,
        maxPoints: 499,
        description: 'Categoría avanzada',
        isActive: true,
        associationId: associations[0].id,
      },
      {
        name: 'Tercera',
        level: CategoryLevel.INTERMEDIATE,
        minPoints: 150,
        maxPoints: 299,
        description: 'Categoría intermedia',
        isActive: true,
        associationId: associations[0].id,
      },
      {
        name: 'Cuarta',
        level: CategoryLevel.BEGINNER,
        minPoints: 0,
        maxPoints: 149,
        description: 'Categoría principiante',
        isActive: true,
        associationId: associations[0].id,
      },
    ]);
    console.log(`✅ ${categories.length} categorías creadas`);

    // 5. Crear Temporadas
    console.log('📅 Creando temporadas...');
    const seasons = await dataSource.getRepository(Season).save([
      {
        associationId: associations[0].id,
        name: 'Temporada 2024',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      },
      {
        associationId: associations[0].id,
        name: 'Temporada 2025',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
      {
        associationId: associations[1].id,
        name: 'Temporada Verano 2024',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-03-31'),
      },
    ]);
    console.log(`✅ ${seasons.length} temporadas creadas`);

    // 6. Crear Torneos
    console.log('🎾 Creando torneos...');
    const tournaments = await dataSource.getRepository(Tournament).save([
      {
        name: 'Torneo Apertura 2024',
        description: 'Torneo de apertura de la temporada 2024',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-17'),
        status: TournamentStatus.COMPLETED,
        type: TournamentType.SINGLE_ELIMINATION,
        settings: {
          maxTeams: 16,
          minTeams: 8,
          teamSize: 2,
          categoryRange: { min: 1, max: 4 },
          pointsDistribution: {
            'winner': 100,
            'finalist': 75,
            'semifinalist': 50,
            'quarterfinalist': 25,
          },
          tiebreakers: ['head_to_head', 'points_difference'],
        },
        isPublic: true,
        associationId: associations[0].id,
      },
      {
        name: 'Copa de Verano 2024',
        description: 'Torneo especial de verano',
        startDate: new Date('2024-12-20'),
        endDate: new Date('2024-12-22'),
        status: TournamentStatus.IN_PROGRESS,
        type: TournamentType.GROUPS_KNOCKOUT,
        settings: {
          maxTeams: 24,
          minTeams: 12,
          teamSize: 2,
          categoryRange: { min: 2, max: 4 },
          pointsDistribution: {
            'winner': 80,
            'finalist': 60,
            'semifinalist': 40,
            'quarterfinalist': 20,
          },
          tiebreakers: ['head_to_head', 'sets_difference'],
        },
        isPublic: true,
        associationId: associations[0].id,
      },
      {
        name: 'Torneo Clausura 2025',
        description: 'Torneo de clausura de la temporada',
        startDate: new Date('2025-11-10'),
        endDate: new Date('2025-11-12'),
        status: TournamentStatus.REGISTRATION_OPEN,
        type: TournamentType.DOUBLE_ELIMINATION,
        settings: {
          maxTeams: 32,
          minTeams: 16,
          teamSize: 2,
          categoryRange: { min: 1, max: 3 },
          pointsDistribution: {
            'winner': 120,
            'finalist': 90,
            'semifinalist': 60,
            'quarterfinalist': 30,
          },
          tiebreakers: ['head_to_head', 'points_difference', 'games_difference'],
        },
        isPublic: true,
        associationId: associations[0].id,
      },
    ]);
    console.log(`✅ ${tournaments.length} torneos creados`);

    // 7. Crear Equipos
    console.log('👥 Creando equipos...');
    const teams = await dataSource.getRepository(TournamentTeam).save([
      {
        name: 'Los Cracks',
        tournamentId: tournaments[0].id,
        points: 6,
        matchesWon: 3,
        matchesLost: 0,
        setsWon: 6,
        setsLost: 1,
        gamesWon: 42,
        gamesLost: 28,
        seed: '1',
        isEliminated: false,
      },
      {
        name: 'Pádel Masters',
        tournamentId: tournaments[0].id,
        points: 4,
        matchesWon: 2,
        matchesLost: 1,
        setsWon: 5,
        setsLost: 3,
        gamesWon: 38,
        gamesLost: 32,
        seed: '2',
        isEliminated: false,
      },
      {
        name: 'Equipo Rojo',
        tournamentId: tournaments[1].id,
        points: 3,
        matchesWon: 1,
        matchesLost: 1,
        setsWon: 3,
        setsLost: 3,
        gamesWon: 30,
        gamesLost: 30,
        seed: '3',
        isEliminated: false,
      },
      {
        name: 'Equipo Azul',
        tournamentId: tournaments[1].id,
        points: 2,
        matchesWon: 1,
        matchesLost: 1,
        setsWon: 2,
        setsLost: 3,
        gamesWon: 25,
        gamesLost: 28,
        seed: '4',
        isEliminated: false,
      },
      {
        name: 'Los Invencibles',
        tournamentId: tournaments[2].id,
        points: 0,
        matchesWon: 0,
        matchesLost: 0,
        setsWon: 0,
        setsLost: 0,
        gamesWon: 0,
        gamesLost: 0,
        seed: '1',
        isEliminated: false,
      },
      {
        name: 'Dream Team',
        tournamentId: tournaments[2].id,
        points: 0,
        matchesWon: 0,
        matchesLost: 0,
        setsWon: 0,
        setsLost: 0,
        gamesWon: 0,
        gamesLost: 0,
        seed: '2',
        isEliminated: false,
      },
    ]);
    console.log(`✅ ${teams.length} equipos creados`);

    // 8. Crear Jugadores de Torneo
    console.log('🎮 Creando jugadores de torneo...');
    const tournamentPlayers = await dataSource.getRepository(TournamentPlayer).save([
      {
        userId: users[2].id,
        teamId: teams[0].id,
        category: 3,
      },
      {
        userId: users[3].id,
        teamId: teams[0].id,
        category: 2,
      },
      {
        userId: users[4].id,
        teamId: teams[1].id,
        category: 4,
      },
      {
        userId: users[5].id,
        teamId: teams[1].id,
        category: 3,
      },
      {
        userId: users[6].id,
        teamId: teams[2].id,
        category: 2,
      },
      {
        userId: users[7].id,
        teamId: teams[2].id,
        category: 1,
      },
      {
        userId: users[2].id,
        teamId: teams[3].id,
        category: 3,
      },
      {
        userId: users[4].id,
        teamId: teams[3].id,
        category: 4,
      },
      {
        userId: users[3].id,
        teamId: teams[4].id,
        category: 2,
      },
      {
        userId: users[5].id,
        teamId: teams[4].id,
        category: 3,
      },
      {
        userId: users[6].id,
        teamId: teams[5].id,
        category: 2,
      },
      {
        userId: users[7].id,
        teamId: teams[5].id,
        category: 1,
      },
    ]);
    console.log(`✅ ${tournamentPlayers.length} jugadores de torneo creados`);

    // 9. Crear Registros de Torneo
    console.log('📝 Creando registros de torneo...');
    const registrations = await dataSource.getRepository(TournamentRegistration).save([
      {
        tournamentId: tournaments[0].id,
        teamId: teams[0].id,
        status: 'approved',
        rejectionReason: null,
      },
      {
        tournamentId: tournaments[0].id,
        teamId: teams[1].id,
        status: 'approved',
        rejectionReason: null,
      },
      {
        tournamentId: tournaments[1].id,
        teamId: teams[2].id,
        status: 'approved',
        rejectionReason: null,
      },
      {
        tournamentId: tournaments[1].id,
        teamId: teams[3].id,
        status: 'approved',
        rejectionReason: null,
      },
      {
        tournamentId: tournaments[2].id,
        teamId: teams[4].id,
        status: 'pending',
        rejectionReason: null,
      },
      {
        tournamentId: tournaments[2].id,
        teamId: teams[5].id,
        status: 'pending',
        rejectionReason: null,
      },
    ]);
    console.log(`✅ ${registrations.length} registros de torneo creados`);

    // 10. Crear Partidos
    console.log('⚔️  Creando partidos...');
    const matches = await dataSource.getRepository(TournamentMatch).save([
      {
        tournamentId: tournaments[0].id,
        round: 1,
        matchNumber: 1,
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        status: 'completed',
        score: {
          sets: [
            { homeScore: 6, awayScore: 4 },
            { homeScore: 6, awayScore: 3 },
          ],
          winner: 'home',
        },
        scheduledTime: new Date('2024-03-15T10:00:00'),
        winnerTeamId: teams[0].id,
        notes: 'Partido muy reñido en el primer set',
      },
      {
        tournamentId: tournaments[0].id,
        round: 2,
        matchNumber: 1,
        homeTeamId: teams[0].id,
        awayTeamId: teams[1].id,
        status: 'completed',
        score: {
          sets: [
            { homeScore: 7, awayScore: 5 },
            { homeScore: 6, awayScore: 4 },
          ],
          winner: 'home',
        },
        scheduledTime: new Date('2024-03-16T14:00:00'),
        winnerTeamId: teams[0].id,
        notes: 'Final del torneo',
      },
      {
        tournamentId: tournaments[1].id,
        round: 1,
        matchNumber: 1,
        homeTeamId: teams[2].id,
        awayTeamId: teams[3].id,
        status: 'in_progress',
        score: {
          sets: [
            { homeScore: 6, awayScore: 4 },
            { homeScore: 3, awayScore: 5 },
          ],
        },
        scheduledTime: new Date('2024-12-20T16:00:00'),
        winnerTeamId: null,
        notes: 'Partido en curso',
      },
      {
        tournamentId: tournaments[2].id,
        round: 1,
        matchNumber: 1,
        homeTeamId: teams[4].id,
        awayTeamId: teams[5].id,
        status: 'scheduled',
        scheduledTime: new Date('2025-11-10T10:00:00'),
        winnerTeamId: null,
        notes: 'Primer partido del torneo',
      },
    ]);
    console.log(`✅ ${matches.length} partidos creados`);

    // 11. Crear Notificaciones
    console.log('🔔 Creando notificaciones...');
    const notifications = await dataSource.getRepository(Notification).save([
      {
        type: NotificationType.TOURNAMENT_INVITATION,
        message: 'Has sido invitado al Torneo Apertura 2024',
        metadata: { tournamentId: tournaments[0].id, tournamentName: 'Torneo Apertura 2024' },
        status: NotificationStatus.READ,
        userId: users[2].id,
        isRead: true,
        readAt: new Date('2024-03-10T12:00:00'),
      },
      {
        type: NotificationType.MATCH_SCHEDULED,
        message: 'Tu partido está programado para el 20 de diciembre a las 16:00',
        metadata: { matchId: matches[2].id, scheduledTime: '2024-12-20T16:00:00' },
        status: NotificationStatus.UNREAD,
        userId: users[6].id,
        isRead: false,
        readAt: null,
      },
      {
        type: NotificationType.MATCH_RESULT,
        message: 'Resultado del partido: Los Cracks 2 - 0 Pádel Masters',
        metadata: { matchId: matches[0].id, result: 'win' },
        status: NotificationStatus.READ,
        userId: users[2].id,
        isRead: true,
        readAt: new Date('2024-03-15T18:00:00'),
      },
      {
        type: NotificationType.TOURNAMENT_UPDATE,
        message: 'El Torneo Clausura 2025 ha abierto inscripciones',
        metadata: { tournamentId: tournaments[2].id },
        status: NotificationStatus.UNREAD,
        userId: users[3].id,
        isRead: false,
        readAt: null,
      },
      {
        type: NotificationType.ASSOCIATION_INVITATION,
        message: 'Has sido invitado a unirte a la Asociación de Pádel de Buenos Aires',
        metadata: { associationId: associations[0].id, associationName: 'Asociación de Pádel de Buenos Aires' },
        status: NotificationStatus.ARCHIVED,
        userId: users[4].id,
        isRead: true,
        readAt: new Date('2024-01-15T10:00:00'),
      },
      {
        type: NotificationType.GENERAL,
        message: 'Bienvenido a la plataforma de torneos de pádel',
        metadata: {},
        status: NotificationStatus.READ,
        userId: users[5].id,
        isRead: true,
        readAt: new Date('2024-01-01T09:00:00'),
      },
    ]);
    console.log(`✅ ${notifications.length} notificaciones creadas`);

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${users.length} usuarios`);
    console.log(`   - ${associations.length} asociaciones`);
    console.log(`   - ${memberships.length} membresías`);
    console.log(`   - ${categories.length} categorías`);
    console.log(`   - ${seasons.length} temporadas`);
    console.log(`   - ${tournaments.length} torneos`);
    console.log(`   - ${teams.length} equipos`);
    console.log(`   - ${tournamentPlayers.length} jugadores de torneo`);
    console.log(`   - ${registrations.length} registros`);
    console.log(`   - ${matches.length} partidos`);
    console.log(`   - ${notifications.length} notificaciones`);
    console.log('\n✅ La base de datos está lista para probar la aplicación');
    console.log('\n🔑 Credenciales de prueba:');
    console.log('   Email: admin@padel.com');
    console.log('   Password: password123');

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

seed();
