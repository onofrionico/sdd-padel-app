import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

async function seed() {
  const configService = new ConfigService();
  
  const dataSource = new DataSource({
    type: 'postgres',
    host: configService.get('DATABASE_HOST', 'localhost'),
    port: +configService.get<number>('DATABASE_PORT', 5432),
    username: configService.get('DATABASE_USERNAME', 'nicolasagustinonofrio'),
    password: configService.get('DATABASE_PASSWORD', ''),
    database: configService.get('DATABASE_NAME', 'padel_tournament'),
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexión a la base de datos establecida');

    // Limpiar datos existentes (en orden inverso por las relaciones)
    console.log('🗑️  Limpiando datos existentes...');
    await dataSource.query('TRUNCATE TABLE notifications CASCADE');
    await dataSource.query('TRUNCATE TABLE tournament_matches CASCADE');
    await dataSource.query('TRUNCATE TABLE tournament_registrations CASCADE');
    await dataSource.query('TRUNCATE TABLE tournament_players CASCADE');
    await dataSource.query('TRUNCATE TABLE tournament_teams CASCADE');
    await dataSource.query('TRUNCATE TABLE tournaments CASCADE');
    await dataSource.query('TRUNCATE TABLE seasons CASCADE');
    await dataSource.query('TRUNCATE TABLE categories CASCADE');
    await dataSource.query('TRUNCATE TABLE association_memberships CASCADE');
    await dataSource.query('TRUNCATE TABLE associations CASCADE');
    await dataSource.query('TRUNCATE TABLE users CASCADE');

    // 1. Crear Usuarios
    console.log('👥 Creando usuarios...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const userIds = [];
    for (const userData of [
      { email: 'admin@padel.com', firstName: 'Admin', lastName: 'Sistema', role: 'admin', gender: 'male', phone: '+54 11 1234-5678', dob: '1985-05-15', hand: 'right', style: 'all_around' },
      { email: 'juan.perez@email.com', firstName: 'Juan', lastName: 'Pérez', role: 'organizer', gender: 'male', phone: '+54 11 2345-6789', dob: '1990-03-20', hand: 'right', style: 'offensive' },
      { email: 'maria.garcia@email.com', firstName: 'María', lastName: 'García', role: 'user', gender: 'female', phone: '+54 11 3456-7890', dob: '1992-07-10', hand: 'left', style: 'defensive' },
      { email: 'carlos.rodriguez@email.com', firstName: 'Carlos', lastName: 'Rodríguez', role: 'user', gender: 'male', phone: '+54 11 4567-8901', dob: '1988-11-25', hand: 'right', style: 'all_around' },
      { email: 'ana.martinez@email.com', firstName: 'Ana', lastName: 'Martínez', role: 'user', gender: 'female', phone: '+54 11 5678-9012', dob: '1995-02-14', hand: 'right', style: 'offensive' },
      { email: 'pedro.lopez@email.com', firstName: 'Pedro', lastName: 'López', role: 'user', gender: 'male', phone: '+54 11 6789-0123', dob: '1991-09-05', hand: 'left', style: 'defensive' },
      { email: 'laura.fernandez@email.com', firstName: 'Laura', lastName: 'Fernández', role: 'user', gender: 'female', phone: '+54 11 7890-1234', dob: '1993-06-18', hand: 'right', style: 'all_around' },
      { email: 'diego.sanchez@email.com', firstName: 'Diego', lastName: 'Sánchez', role: 'user', gender: 'male', phone: '+54 11 8901-2345', dob: '1989-12-30', hand: 'right', style: 'offensive' },
    ]) {
      const result = await dataSource.query(
        `INSERT INTO users (email, password, "firstName", "lastName", role, gender, "phoneNumber", "dateOfBirth", "playingHand", "playingStyle", "isVerified", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, NOW(), NOW())
         RETURNING id`,
        [userData.email, hashedPassword, userData.firstName, userData.lastName, userData.role, userData.gender, userData.phone, userData.dob, userData.hand, userData.style]
      );
      userIds.push(result[0].id);
    }
    console.log(`✅ ${userIds.length} usuarios creados`);

    // 2. Crear Asociaciones
    console.log('🏢 Creando asociaciones...');
    const associationIds = [];
    for (const assocData of [
      { name: 'Asociación de Pádel de Buenos Aires', desc: 'Principal asociación de pádel de la Ciudad de Buenos Aires', logo: 'https://example.com/logos/apba.png', web: 'https://apba.com.ar', points: { final: 100, semifinal: 75, cuartos: 50, octavos: 25, primera_ronda: 10 } },
      { name: 'Club Náutico San Isidro', desc: 'Club deportivo con canchas de pádel de primer nivel', logo: 'https://example.com/logos/cnsi.png', web: 'https://cnsi.com.ar', points: { final: 80, semifinal: 60, cuartos: 40, octavos: 20 } },
      { name: 'Federación Argentina de Pádel', desc: 'Federación nacional que regula el pádel en Argentina', logo: 'https://example.com/logos/fap.png', web: 'https://fap.org.ar', points: { final: 150, semifinal: 100, cuartos: 75, octavos: 50, primera_ronda: 25 } },
    ]) {
      const result = await dataSource.query(
        `INSERT INTO associations (name, description, "logoUrl", website, "isActive", "pointsByRound", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, true, $5, NOW(), NOW())
         RETURNING id`,
        [assocData.name, assocData.desc, assocData.logo, assocData.web, JSON.stringify(assocData.points)]
      );
      associationIds.push(result[0].id);
    }
    console.log(`✅ ${associationIds.length} asociaciones creadas`);

    // 3. Crear Membresías
    console.log('👤 Creando membresías...');
    const memberships = [
      { userId: userIds[0], assocId: associationIds[0], role: 'admin', category: 1, points: 500 },
      { userId: userIds[1], assocId: associationIds[0], role: 'organizer', category: 2, points: 350 },
      { userId: userIds[2], assocId: associationIds[0], role: 'member', category: 3, points: 280 },
      { userId: userIds[3], assocId: associationIds[0], role: 'member', category: 2, points: 420 },
      { userId: userIds[4], assocId: associationIds[1], role: 'member', category: 4, points: 180 },
      { userId: userIds[5], assocId: associationIds[1], role: 'member', category: 3, points: 310 },
      { userId: userIds[6], assocId: associationIds[2], role: 'member', category: 2, points: 390 },
      { userId: userIds[7], assocId: associationIds[2], role: 'member', category: 1, points: 550 },
    ];
    for (const m of memberships) {
      await dataSource.query(
        `INSERT INTO association_memberships ("userId", "associationId", role, category, points, "joinedAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
        [m.userId, m.assocId, m.role, m.category, m.points]
      );
    }
    console.log(`✅ ${memberships.length} membresías creadas`);

    // 4. Crear Categorías
    console.log('🏆 Creando categorías...');
    const categoryIds = [];
    for (const catData of [
      { name: 'Primera', level: 'professional', min: 500, max: 1000, desc: 'Categoría profesional de máximo nivel', assocId: associationIds[0] },
      { name: 'Segunda', level: 'advanced', min: 300, max: 499, desc: 'Categoría avanzada', assocId: associationIds[0] },
      { name: 'Tercera', level: 'intermediate', min: 150, max: 299, desc: 'Categoría intermedia', assocId: associationIds[0] },
      { name: 'Cuarta', level: 'beginner', min: 0, max: 149, desc: 'Categoría principiante', assocId: associationIds[0] },
    ]) {
      const result = await dataSource.query(
        `INSERT INTO categories (name, level, "minPoints", "maxPoints", description, "isActive", "associationId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, true, $6, NOW(), NOW())
         RETURNING id`,
        [catData.name, catData.level, catData.min, catData.max, catData.desc, catData.assocId]
      );
      categoryIds.push(result[0].id);
    }
    console.log(`✅ ${categoryIds.length} categorías creadas`);

    // 5. Crear Temporadas
    console.log('📅 Creando temporadas...');
    const seasonIds = [];
    for (const seasonData of [
      { name: 'Temporada 2023', assocId: associationIds[0], start: '2023-01-01', end: '2023-12-31' },
      { name: 'Temporada 2024', assocId: associationIds[0], start: '2024-01-01', end: '2024-12-31' },
      { name: 'Temporada 2025', assocId: associationIds[0], start: '2025-01-01', end: '2025-12-31' },
      { name: 'Temporada 2026', assocId: associationIds[0], start: '2026-01-01', end: '2026-12-31' },
      { name: 'Temporada Verano 2024', assocId: associationIds[1], start: '2024-12-01', end: '2025-03-31' },
    ]) {
      const result = await dataSource.query(
        `INSERT INTO seasons ("associationId", name, "startDate", "endDate", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         RETURNING id`,
        [seasonData.assocId, seasonData.name, seasonData.start, seasonData.end]
      );
      seasonIds.push(result[0].id);
    }
    console.log(`✅ ${seasonIds.length} temporadas creadas`);

    // 6. Crear Torneos
    console.log('🎾 Creando torneos...');
    const tournamentIds = [];
    const tournaments = [
      // Torneos 2023 (históricos)
      { name: 'Torneo Apertura 2023', desc: 'Torneo de apertura de la temporada 2023', start: '2023-03-10', end: '2023-03-12', status: 'completed', type: 'single_elimination', settings: { maxTeams: 16, minTeams: 8, teamSize: 2, categoryRange: { min: 1, max: 4 }, pointsDistribution: { winner: 100, finalist: 75, semifinalist: 50, quarterfinalist: 25 }, tiebreakers: ['head_to_head', 'points_difference'] }, assocId: associationIds[0] },
      { name: 'Copa Primavera 2023', desc: 'Torneo de primavera', start: '2023-09-15', end: '2023-09-17', status: 'completed', type: 'groups_knockout', settings: { maxTeams: 16, minTeams: 8, teamSize: 2, categoryRange: { min: 1, max: 4 }, pointsDistribution: { winner: 90, finalist: 65, semifinalist: 45, quarterfinalist: 20 }, tiebreakers: ['head_to_head', 'sets_difference'] }, assocId: associationIds[0] },
      { name: 'Torneo Clausura 2023', desc: 'Torneo de clausura de la temporada 2023', start: '2023-11-20', end: '2023-11-22', status: 'completed', type: 'single_elimination', settings: { maxTeams: 16, minTeams: 8, teamSize: 2, categoryRange: { min: 1, max: 4 }, pointsDistribution: { winner: 100, finalist: 75, semifinalist: 50, quarterfinalist: 25 }, tiebreakers: ['head_to_head', 'points_difference'] }, assocId: associationIds[0] },
      // Torneos 2024
      { name: 'Torneo Apertura 2024', desc: 'Torneo de apertura de la temporada 2024', start: '2024-03-15', end: '2024-03-17', status: 'completed', type: 'single_elimination', settings: { maxTeams: 16, minTeams: 8, teamSize: 2, categoryRange: { min: 1, max: 4 }, pointsDistribution: { winner: 100, finalist: 75, semifinalist: 50, quarterfinalist: 25 }, tiebreakers: ['head_to_head', 'points_difference'] }, assocId: associationIds[0] },
      { name: 'Copa Invierno 2024', desc: 'Torneo de invierno', start: '2024-06-10', end: '2024-06-12', status: 'completed', type: 'groups_knockout', settings: { maxTeams: 16, minTeams: 8, teamSize: 2, categoryRange: { min: 1, max: 4 }, pointsDistribution: { winner: 85, finalist: 60, semifinalist: 40, quarterfinalist: 20 }, tiebreakers: ['head_to_head', 'sets_difference'] }, assocId: associationIds[0] },
      { name: 'Torneo Clausura 2024', desc: 'Torneo de clausura de la temporada 2024', start: '2024-11-15', end: '2024-11-17', status: 'completed', type: 'single_elimination', settings: { maxTeams: 16, minTeams: 8, teamSize: 2, categoryRange: { min: 1, max: 4 }, pointsDistribution: { winner: 100, finalist: 75, semifinalist: 50, quarterfinalist: 25 }, tiebreakers: ['head_to_head', 'points_difference'] }, assocId: associationIds[0] },
      { name: 'Copa de Verano 2024', desc: 'Torneo especial de verano', start: '2024-12-20', end: '2024-12-22', status: 'in_progress', type: 'groups_knockout', settings: { maxTeams: 24, minTeams: 12, teamSize: 2, categoryRange: { min: 2, max: 4 }, pointsDistribution: { winner: 80, finalist: 60, semifinalist: 40, quarterfinalist: 20 }, tiebreakers: ['head_to_head', 'sets_difference'] }, assocId: associationIds[0] },
      // Torneos 2025
      { name: 'Torneo Clausura 2025', desc: 'Torneo de clausura de la temporada', start: '2025-11-10', end: '2025-11-12', status: 'registration_open', type: 'double_elimination', settings: { maxTeams: 32, minTeams: 16, teamSize: 2, categoryRange: { min: 1, max: 3 }, pointsDistribution: { winner: 120, finalist: 90, semifinalist: 60, quarterfinalist: 30 }, tiebreakers: ['head_to_head', 'points_difference', 'games_difference'] }, assocId: associationIds[0] },
    ];

    for (const tData of tournaments) {
      const result = await dataSource.query(
        `INSERT INTO tournaments (name, description, "startDate", "endDate", status, type, settings, "isPublic", "associationId", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, NOW(), NOW())
         RETURNING id`,
        [tData.name, tData.desc, tData.start, tData.end, tData.status, tData.type, JSON.stringify(tData.settings), tData.assocId]
      );
      tournamentIds.push(result[0].id);
    }
    console.log(`✅ ${tournamentIds.length} torneos creados`);

    // 7. Crear Equipos
    console.log('👥 Creando equipos...');
    const teamIds = [];
    const teams = [
      // Torneo Apertura 2023 (tournamentIds[0])
      { name: 'Los Tigres', tId: tournamentIds[0], points: 100, won: 4, lost: 0, setsW: 8, setsL: 1, gamesW: 54, gamesL: 32, seed: '1' },
      { name: 'Los Leones', tId: tournamentIds[0], points: 75, won: 3, lost: 1, setsW: 7, setsL: 3, gamesW: 48, gamesL: 38, seed: '2' },
      { name: 'Los Halcones', tId: tournamentIds[0], points: 50, won: 2, lost: 1, setsW: 5, setsL: 3, gamesW: 42, gamesL: 36, seed: '3' },
      { name: 'Los Cóndores', tId: tournamentIds[0], points: 50, won: 2, lost: 1, setsW: 4, setsL: 4, gamesW: 38, gamesL: 40, seed: '4' },
      // Copa Primavera 2023 (tournamentIds[1])
      { name: 'Águilas Rojas', tId: tournamentIds[1], points: 90, won: 4, lost: 0, setsW: 8, setsL: 2, gamesW: 52, gamesL: 35, seed: '1' },
      { name: 'Lobos Grises', tId: tournamentIds[1], points: 65, won: 3, lost: 1, setsW: 6, setsL: 3, gamesW: 45, gamesL: 38, seed: '2' },
      { name: 'Panteras Negras', tId: tournamentIds[1], points: 45, won: 2, lost: 1, setsW: 5, setsL: 4, gamesW: 40, gamesL: 42, seed: '3' },
      { name: 'Zorros Plateados', tId: tournamentIds[1], points: 45, won: 2, lost: 1, setsW: 4, setsL: 3, gamesW: 38, gamesL: 35, seed: '4' },
      // Torneo Clausura 2023 (tournamentIds[2])
      { name: 'Los Campeones', tId: tournamentIds[2], points: 100, won: 4, lost: 0, setsW: 8, setsL: 0, gamesW: 48, gamesL: 28, seed: '1' },
      { name: 'Los Guerreros', tId: tournamentIds[2], points: 75, won: 3, lost: 1, setsW: 6, setsL: 3, gamesW: 44, gamesL: 36, seed: '2' },
      { name: 'Los Titanes', tId: tournamentIds[2], points: 50, won: 2, lost: 1, setsW: 5, setsL: 3, gamesW: 40, gamesL: 35, seed: '3' },
      { name: 'Los Gladiadores', tId: tournamentIds[2], points: 50, won: 2, lost: 1, setsW: 4, setsL: 4, gamesW: 36, gamesL: 38, seed: '4' },
      // Torneo Apertura 2024 (tournamentIds[3])
      { name: 'Los Cracks', tId: tournamentIds[3], points: 100, won: 4, lost: 0, setsW: 8, setsL: 1, gamesW: 50, gamesL: 30, seed: '1' },
      { name: 'Pádel Masters', tId: tournamentIds[3], points: 75, won: 3, lost: 1, setsW: 6, setsL: 3, gamesW: 46, gamesL: 38, seed: '2' },
      { name: 'Los Relámpagos', tId: tournamentIds[3], points: 50, won: 2, lost: 1, setsW: 5, setsL: 3, gamesW: 42, gamesL: 36, seed: '3' },
      { name: 'Los Truenos', tId: tournamentIds[3], points: 50, won: 2, lost: 1, setsW: 4, setsL: 4, gamesW: 38, gamesL: 40, seed: '4' },
      // Copa Invierno 2024 (tournamentIds[4])
      { name: 'Fuego Azul', tId: tournamentIds[4], points: 85, won: 4, lost: 0, setsW: 8, setsL: 2, gamesW: 52, gamesL: 36, seed: '1' },
      { name: 'Viento Norte', tId: tournamentIds[4], points: 60, won: 3, lost: 1, setsW: 6, setsL: 3, gamesW: 44, gamesL: 38, seed: '2' },
      { name: 'Tierra Firme', tId: tournamentIds[4], points: 40, won: 2, lost: 1, setsW: 4, setsL: 4, gamesW: 38, gamesL: 40, seed: '3' },
      { name: 'Agua Clara', tId: tournamentIds[4], points: 40, won: 2, lost: 1, setsW: 4, setsL: 3, gamesW: 36, gamesL: 34, seed: '4' },
      // Torneo Clausura 2024 (tournamentIds[5])
      { name: 'Los Invencibles 2024', tId: tournamentIds[5], points: 100, won: 4, lost: 0, setsW: 8, setsL: 1, gamesW: 52, gamesL: 32, seed: '1' },
      { name: 'Dream Team 2024', tId: tournamentIds[5], points: 75, won: 3, lost: 1, setsW: 7, setsL: 3, gamesW: 48, gamesL: 38, seed: '2' },
      { name: 'Los Meteoros', tId: tournamentIds[5], points: 50, won: 2, lost: 1, setsW: 5, setsL: 4, gamesW: 42, gamesL: 40, seed: '3' },
      { name: 'Los Cometas', tId: tournamentIds[5], points: 50, won: 2, lost: 1, setsW: 4, setsL: 4, gamesW: 38, gamesL: 42, seed: '4' },
      // Copa de Verano 2024 (tournamentIds[6]) - en progreso
      { name: 'Equipo Rojo', tId: tournamentIds[6], points: 3, won: 1, lost: 1, setsW: 3, setsL: 3, gamesW: 30, gamesL: 30, seed: '3' },
      { name: 'Equipo Azul', tId: tournamentIds[6], points: 2, won: 1, lost: 1, setsW: 2, setsL: 3, gamesW: 25, gamesL: 28, seed: '4' },
      // Torneo Clausura 2025 (tournamentIds[7]) - futuro
      { name: 'Los Invencibles', tId: tournamentIds[7], points: 0, won: 0, lost: 0, setsW: 0, setsL: 0, gamesW: 0, gamesL: 0, seed: '1' },
      { name: 'Dream Team', tId: tournamentIds[7], points: 0, won: 0, lost: 0, setsW: 0, setsL: 0, gamesW: 0, gamesL: 0, seed: '2' },
    ];

    for (const teamData of teams) {
      const result = await dataSource.query(
        `INSERT INTO tournament_teams (name, "tournamentId", points, "matchesWon", "matchesLost", "setsWon", "setsLost", "gamesWon", "gamesLost", seed, "isEliminated", "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, false, NOW(), NOW())
         RETURNING id`,
        [teamData.name, teamData.tId, teamData.points, teamData.won, teamData.lost, teamData.setsW, teamData.setsL, teamData.gamesW, teamData.gamesL, teamData.seed]
      );
      teamIds.push(result[0].id);
    }
    console.log(`✅ ${teamIds.length} equipos creados`);

    // 8. Crear Jugadores de Torneo
    console.log('🎮 Creando jugadores de torneo...');
    const players = [
      // Torneo Apertura 2023
      { userId: userIds[2], teamId: teamIds[0], cat: 3 }, // María en Los Tigres (ganador)
      { userId: userIds[3], teamId: teamIds[0], cat: 2 }, // Carlos en Los Tigres
      { userId: userIds[4], teamId: teamIds[1], cat: 4 }, // Ana en Los Leones (finalista)
      { userId: userIds[5], teamId: teamIds[1], cat: 3 }, // Pedro en Los Leones
      { userId: userIds[6], teamId: teamIds[2], cat: 2 }, // Laura en Los Halcones (semifinalista)
      { userId: userIds[7], teamId: teamIds[2], cat: 1 }, // Diego en Los Halcones
      { userId: userIds[2], teamId: teamIds[3], cat: 3 }, // María en Los Cóndores (semifinalista)
      { userId: userIds[4], teamId: teamIds[3], cat: 4 }, // Ana en Los Cóndores
      // Copa Primavera 2023
      { userId: userIds[7], teamId: teamIds[4], cat: 1 }, // Diego en Águilas Rojas (ganador)
      { userId: userIds[3], teamId: teamIds[4], cat: 2 }, // Carlos en Águilas Rojas
      { userId: userIds[5], teamId: teamIds[5], cat: 3 }, // Pedro en Lobos Grises (finalista)
      { userId: userIds[6], teamId: teamIds[5], cat: 2 }, // Laura en Lobos Grises
      { userId: userIds[2], teamId: teamIds[6], cat: 3 }, // María en Panteras Negras (semifinalista)
      { userId: userIds[4], teamId: teamIds[6], cat: 4 }, // Ana en Panteras Negras
      { userId: userIds[3], teamId: teamIds[7], cat: 2 }, // Carlos en Zorros Plateados (semifinalista)
      { userId: userIds[7], teamId: teamIds[7], cat: 1 }, // Diego en Zorros Plateados
      // Torneo Clausura 2023
      { userId: userIds[3], teamId: teamIds[8], cat: 2 }, // Carlos en Los Campeones (ganador)
      { userId: userIds[5], teamId: teamIds[8], cat: 3 }, // Pedro en Los Campeones
      { userId: userIds[7], teamId: teamIds[9], cat: 1 }, // Diego en Los Guerreros (finalista)
      { userId: userIds[6], teamId: teamIds[9], cat: 2 }, // Laura en Los Guerreros
      { userId: userIds[2], teamId: teamIds[10], cat: 3 }, // María en Los Titanes (semifinalista)
      { userId: userIds[4], teamId: teamIds[10], cat: 4 }, // Ana en Los Titanes
      { userId: userIds[5], teamId: teamIds[11], cat: 3 }, // Pedro en Los Gladiadores (semifinalista)
      { userId: userIds[6], teamId: teamIds[11], cat: 2 }, // Laura en Los Gladiadores
      // Torneo Apertura 2024
      { userId: userIds[2], teamId: teamIds[12], cat: 3 }, // María en Los Cracks (ganador)
      { userId: userIds[3], teamId: teamIds[12], cat: 2 }, // Carlos en Los Cracks
      { userId: userIds[4], teamId: teamIds[13], cat: 4 }, // Ana en Pádel Masters (finalista)
      { userId: userIds[5], teamId: teamIds[13], cat: 3 }, // Pedro en Pádel Masters
      { userId: userIds[6], teamId: teamIds[14], cat: 2 }, // Laura en Los Relámpagos (semifinalista)
      { userId: userIds[7], teamId: teamIds[14], cat: 1 }, // Diego en Los Relámpagos
      { userId: userIds[3], teamId: teamIds[15], cat: 2 }, // Carlos en Los Truenos (semifinalista)
      { userId: userIds[5], teamId: teamIds[15], cat: 3 }, // Pedro en Los Truenos
      // Copa Invierno 2024
      { userId: userIds[7], teamId: teamIds[16], cat: 1 }, // Diego en Fuego Azul (ganador)
      { userId: userIds[2], teamId: teamIds[16], cat: 3 }, // María en Fuego Azul
      { userId: userIds[6], teamId: teamIds[17], cat: 2 }, // Laura en Viento Norte (finalista)
      { userId: userIds[4], teamId: teamIds[17], cat: 4 }, // Ana en Viento Norte
      { userId: userIds[3], teamId: teamIds[18], cat: 2 }, // Carlos en Tierra Firme (semifinalista)
      { userId: userIds[5], teamId: teamIds[18], cat: 3 }, // Pedro en Tierra Firme
      { userId: userIds[2], teamId: teamIds[19], cat: 3 }, // María en Agua Clara (semifinalista)
      { userId: userIds[7], teamId: teamIds[19], cat: 1 }, // Diego en Agua Clara
      // Torneo Clausura 2024
      { userId: userIds[5], teamId: teamIds[20], cat: 3 }, // Pedro en Los Invencibles 2024 (ganador)
      { userId: userIds[7], teamId: teamIds[20], cat: 1 }, // Diego en Los Invencibles 2024
      { userId: userIds[3], teamId: teamIds[21], cat: 2 }, // Carlos en Dream Team 2024 (finalista)
      { userId: userIds[6], teamId: teamIds[21], cat: 2 }, // Laura en Dream Team 2024
      { userId: userIds[2], teamId: teamIds[22], cat: 3 }, // María en Los Meteoros (semifinalista)
      { userId: userIds[4], teamId: teamIds[22], cat: 4 }, // Ana en Los Meteoros
      { userId: userIds[5], teamId: teamIds[23], cat: 3 }, // Pedro en Los Cometas (semifinalista)
      { userId: userIds[7], teamId: teamIds[23], cat: 1 }, // Diego en Los Cometas
      // Copa de Verano 2024 (en progreso)
      { userId: userIds[6], teamId: teamIds[24], cat: 2 }, // Laura en Equipo Rojo
      { userId: userIds[7], teamId: teamIds[24], cat: 1 }, // Diego en Equipo Rojo
      { userId: userIds[2], teamId: teamIds[25], cat: 3 }, // María en Equipo Azul
      { userId: userIds[4], teamId: teamIds[25], cat: 4 }, // Ana en Equipo Azul
      // Torneo Clausura 2025 (futuro)
      { userId: userIds[3], teamId: teamIds[26], cat: 2 }, // Carlos en Los Invencibles
      { userId: userIds[5], teamId: teamIds[26], cat: 3 }, // Pedro en Los Invencibles
      { userId: userIds[6], teamId: teamIds[27], cat: 2 }, // Laura en Dream Team
      { userId: userIds[7], teamId: teamIds[27], cat: 1 }, // Diego en Dream Team
    ];
    for (const p of players) {
      await dataSource.query(
        `INSERT INTO tournament_players ("userId", "teamId", category, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [p.userId, p.teamId, p.cat]
      );
    }
    console.log(`✅ ${players.length} jugadores de torneo creados`);

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('\n📊 Resumen:');
    console.log(`   - ${userIds.length} usuarios`);
    console.log(`   - ${associationIds.length} asociaciones`);
    console.log(`   - ${memberships.length} membresías`);
    console.log(`   - ${categoryIds.length} categorías`);
    console.log(`   - ${seasonIds.length} temporadas`);
    console.log(`   - ${tournamentIds.length} torneos (${tournamentIds.length - 2} completados, 1 en progreso, 1 futuro)`);
    console.log(`   - ${teamIds.length} equipos`);
    console.log(`   - ${players.length} jugadores de torneo`);
    console.log('\n📈 Datos históricos de rankings:');
    console.log('   - Temporada 2023: 3 torneos completados');
    console.log('   - Temporada 2024: 3 torneos completados, 1 en progreso');
    console.log('   - Temporada 2025: 1 torneo futuro');
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
