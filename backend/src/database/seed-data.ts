import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

export async function seedDatabase(dataSource: DataSource) {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Verificar si ya existen usuarios
  const userCount = await dataSource.query('SELECT COUNT(*) as count FROM users');
  if (parseInt(userCount[0].count) > 0) {
    console.log('⚠️  La base de datos ya contiene datos. Saltando seed...');
    return;
  }

  console.log('📝 Base de datos vacía, procediendo con el seed...');

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
  for (const tData of [
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
  ]) {
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
  for (const teamData of [
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
  ]) {
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

  // 9. Crear Registros de Torneo
  console.log('📝 Creando registros de torneo...');
  const registrations = [
    // Torneo Apertura 2023
    { tId: tournamentIds[0], teamId: teamIds[0], status: 'approved' },
    { tId: tournamentIds[0], teamId: teamIds[1], status: 'approved' },
    { tId: tournamentIds[0], teamId: teamIds[2], status: 'approved' },
    { tId: tournamentIds[0], teamId: teamIds[3], status: 'approved' },
    // Copa Primavera 2023
    { tId: tournamentIds[1], teamId: teamIds[4], status: 'approved' },
    { tId: tournamentIds[1], teamId: teamIds[5], status: 'approved' },
    { tId: tournamentIds[1], teamId: teamIds[6], status: 'approved' },
    { tId: tournamentIds[1], teamId: teamIds[7], status: 'approved' },
    // Torneo Clausura 2023
    { tId: tournamentIds[2], teamId: teamIds[8], status: 'approved' },
    { tId: tournamentIds[2], teamId: teamIds[9], status: 'approved' },
    { tId: tournamentIds[2], teamId: teamIds[10], status: 'approved' },
    { tId: tournamentIds[2], teamId: teamIds[11], status: 'approved' },
    // Torneo Apertura 2024
    { tId: tournamentIds[3], teamId: teamIds[12], status: 'approved' },
    { tId: tournamentIds[3], teamId: teamIds[13], status: 'approved' },
    { tId: tournamentIds[3], teamId: teamIds[14], status: 'approved' },
    { tId: tournamentIds[3], teamId: teamIds[15], status: 'approved' },
    // Copa Invierno 2024
    { tId: tournamentIds[4], teamId: teamIds[16], status: 'approved' },
    { tId: tournamentIds[4], teamId: teamIds[17], status: 'approved' },
    { tId: tournamentIds[4], teamId: teamIds[18], status: 'approved' },
    { tId: tournamentIds[4], teamId: teamIds[19], status: 'approved' },
    // Torneo Clausura 2024
    { tId: tournamentIds[5], teamId: teamIds[20], status: 'approved' },
    { tId: tournamentIds[5], teamId: teamIds[21], status: 'approved' },
    { tId: tournamentIds[5], teamId: teamIds[22], status: 'approved' },
    { tId: tournamentIds[5], teamId: teamIds[23], status: 'approved' },
    // Copa de Verano 2024
    { tId: tournamentIds[6], teamId: teamIds[24], status: 'approved' },
    { tId: tournamentIds[6], teamId: teamIds[25], status: 'approved' },
    // Torneo Clausura 2025
    { tId: tournamentIds[7], teamId: teamIds[26], status: 'pending' },
    { tId: tournamentIds[7], teamId: teamIds[27], status: 'pending' },
  ];
  for (const r of registrations) {
    await dataSource.query(
      `INSERT INTO tournament_registrations ("tournamentId", "teamId", status, "registeredAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [r.tId, r.teamId, r.status]
    );
  }
  console.log(`✅ ${registrations.length} registros de torneo creados`);

  // 10. Crear Partidos
  console.log('⚔️  Creando partidos...');
  const matches = [
    // Torneo Apertura 2023 - Semifinales y Final
    { tId: tournamentIds[0], round: 1, num: 1, home: teamIds[0], away: teamIds[2], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 6, awayScore: 3 }], winner: 'home' }, time: '2023-03-11 10:00:00', winner: teamIds[0], notes: 'Semifinal 1' },
    { tId: tournamentIds[0], round: 1, num: 2, home: teamIds[1], away: teamIds[3], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 3 }, { homeScore: 7, awayScore: 5 }], winner: 'home' }, time: '2023-03-11 14:00:00', winner: teamIds[1], notes: 'Semifinal 2' },
    { tId: tournamentIds[0], round: 2, num: 1, home: teamIds[0], away: teamIds[1], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 6, awayScore: 2 }], winner: 'home' }, time: '2023-03-12 16:00:00', winner: teamIds[0], notes: 'Final del torneo' },
    // Copa Primavera 2023
    { tId: tournamentIds[1], round: 1, num: 1, home: teamIds[4], away: teamIds[6], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 3 }, { homeScore: 6, awayScore: 4 }], winner: 'home' }, time: '2023-09-16 10:00:00', winner: teamIds[4], notes: 'Semifinal 1' },
    { tId: tournamentIds[1], round: 1, num: 2, home: teamIds[5], away: teamIds[7], status: 'completed', score: { sets: [{ homeScore: 7, awayScore: 5 }, { homeScore: 6, awayScore: 3 }], winner: 'home' }, time: '2023-09-16 14:00:00', winner: teamIds[5], notes: 'Semifinal 2' },
    { tId: tournamentIds[1], round: 2, num: 1, home: teamIds[4], away: teamIds[5], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 7, awayScore: 5 }], winner: 'home' }, time: '2023-09-17 16:00:00', winner: teamIds[4], notes: 'Final' },
    // Torneo Clausura 2023
    { tId: tournamentIds[2], round: 1, num: 1, home: teamIds[8], away: teamIds[10], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 2 }, { homeScore: 6, awayScore: 3 }], winner: 'home' }, time: '2023-11-21 10:00:00', winner: teamIds[8], notes: 'Semifinal 1' },
    { tId: tournamentIds[2], round: 1, num: 2, home: teamIds[9], away: teamIds[11], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 6, awayScore: 3 }], winner: 'home' }, time: '2023-11-21 14:00:00', winner: teamIds[9], notes: 'Semifinal 2' },
    { tId: tournamentIds[2], round: 2, num: 1, home: teamIds[8], away: teamIds[9], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 0 }, { homeScore: 6, awayScore: 2 }], winner: 'home' }, time: '2023-11-22 16:00:00', winner: teamIds[8], notes: 'Final dominante' },
    // Torneo Apertura 2024
    { tId: tournamentIds[3], round: 1, num: 1, home: teamIds[12], away: teamIds[14], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 6, awayScore: 3 }], winner: 'home' }, time: '2024-03-16 10:00:00', winner: teamIds[12], notes: 'Semifinal 1' },
    { tId: tournamentIds[3], round: 1, num: 2, home: teamIds[13], away: teamIds[15], status: 'completed', score: { sets: [{ homeScore: 7, awayScore: 5 }, { homeScore: 6, awayScore: 4 }], winner: 'home' }, time: '2024-03-16 14:00:00', winner: teamIds[13], notes: 'Semifinal 2' },
    { tId: tournamentIds[3], round: 2, num: 1, home: teamIds[12], away: teamIds[13], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 3 }, { homeScore: 7, awayScore: 5 }], winner: 'home' }, time: '2024-03-17 16:00:00', winner: teamIds[12], notes: 'Final del torneo' },
    // Copa Invierno 2024
    { tId: tournamentIds[4], round: 1, num: 1, home: teamIds[16], away: teamIds[18], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 3 }, { homeScore: 6, awayScore: 4 }], winner: 'home' }, time: '2024-06-11 10:00:00', winner: teamIds[16], notes: 'Semifinal 1' },
    { tId: tournamentIds[4], round: 1, num: 2, home: teamIds[17], away: teamIds[19], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 6, awayScore: 2 }], winner: 'home' }, time: '2024-06-11 14:00:00', winner: teamIds[17], notes: 'Semifinal 2' },
    { tId: tournamentIds[4], round: 2, num: 1, home: teamIds[16], away: teamIds[17], status: 'completed', score: { sets: [{ homeScore: 7, awayScore: 6 }, { homeScore: 6, awayScore: 4 }], winner: 'home' }, time: '2024-06-12 16:00:00', winner: teamIds[16], notes: 'Final muy reñida' },
    // Torneo Clausura 2024
    { tId: tournamentIds[5], round: 1, num: 1, home: teamIds[20], away: teamIds[22], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 6, awayScore: 3 }], winner: 'home' }, time: '2024-11-16 10:00:00', winner: teamIds[20], notes: 'Semifinal 1' },
    { tId: tournamentIds[5], round: 1, num: 2, home: teamIds[21], away: teamIds[23], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 3 }, { homeScore: 7, awayScore: 5 }], winner: 'home' }, time: '2024-11-16 14:00:00', winner: teamIds[21], notes: 'Semifinal 2' },
    { tId: tournamentIds[5], round: 2, num: 1, home: teamIds[20], away: teamIds[21], status: 'completed', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 6, awayScore: 3 }], winner: 'home' }, time: '2024-11-17 16:00:00', winner: teamIds[20], notes: 'Final del torneo' },
    // Copa de Verano 2024 (en progreso)
    { tId: tournamentIds[6], round: 1, num: 1, home: teamIds[24], away: teamIds[25], status: 'in_progress', score: { sets: [{ homeScore: 6, awayScore: 4 }, { homeScore: 3, awayScore: 5 }] }, time: '2024-12-20 16:00:00', winner: null, notes: 'Partido en curso' },
    // Torneo Clausura 2025 (futuro)
    { tId: tournamentIds[7], round: 1, num: 1, home: teamIds[26], away: teamIds[27], status: 'scheduled', score: null, time: '2025-11-10 10:00:00', winner: null, notes: 'Primer partido del torneo' },
  ];
  for (const m of matches) {
    await dataSource.query(
      `INSERT INTO tournament_matches ("tournamentId", round, "matchNumber", "homeTeamId", "awayTeamId", status, score, "scheduledTime", "winnerTeamId", notes, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
      [m.tId, m.round, m.num, m.home, m.away, m.status, m.score ? JSON.stringify(m.score) : null, m.time, m.winner, m.notes]
    );
  }
  console.log(`✅ ${matches.length} partidos creados`);

  // 11. Crear Notificaciones
  console.log('🔔 Creando notificaciones...');
  const notifications = [
    { type: 'tournament_invitation', msg: 'Has sido invitado al Torneo Apertura 2024', meta: { tournamentId: tournamentIds[0], tournamentName: 'Torneo Apertura 2024' }, status: 'read', userId: userIds[2], isRead: true, readAt: '2024-03-10 12:00:00' },
    { type: 'match_scheduled', msg: 'Tu partido está programado para el 20 de diciembre a las 16:00', meta: { scheduledTime: '2024-12-20T16:00:00' }, status: 'unread', userId: userIds[6], isRead: false, readAt: null },
    { type: 'match_result', msg: 'Resultado del partido: Los Cracks 2 - 0 Pádel Masters', meta: { result: 'win' }, status: 'read', userId: userIds[2], isRead: true, readAt: '2024-03-15 18:00:00' },
    { type: 'tournament_update', msg: 'El Torneo Clausura 2025 ha abierto inscripciones', meta: { tournamentId: tournamentIds[2] }, status: 'unread', userId: userIds[3], isRead: false, readAt: null },
    { type: 'association_invitation', msg: 'Has sido invitado a unirte a la Asociación de Pádel de Buenos Aires', meta: { associationId: associationIds[0], associationName: 'Asociación de Pádel de Buenos Aires' }, status: 'archived', userId: userIds[4], isRead: true, readAt: '2024-01-15 10:00:00' },
    { type: 'general', msg: 'Bienvenido a la plataforma de torneos de pádel', meta: {}, status: 'read', userId: userIds[5], isRead: true, readAt: '2024-01-01 09:00:00' },
  ];
  for (const n of notifications) {
    await dataSource.query(
      `INSERT INTO notifications (type, message, metadata, status, "userId", "isRead", "readAt", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [n.type, n.msg, JSON.stringify(n.meta), n.status, n.userId, n.isRead, n.readAt]
    );
  }
  console.log(`✅ ${notifications.length} notificaciones creadas`);

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
  console.log(`   - ${registrations.length} registros`);
  console.log(`   - ${matches.length} partidos`);
  console.log(`   - ${notifications.length} notificaciones`);
  console.log('\n📈 Datos históricos de rankings:');
  console.log('   - Temporada 2023: 3 torneos completados');
  console.log('   - Temporada 2024: 3 torneos completados, 1 en progreso');
  console.log('   - Temporada 2025: 1 torneo futuro');
  console.log('\n✅ La base de datos está lista para probar la aplicación');
  console.log('\n🔑 Credenciales de prueba:');
  console.log('   Email: admin@padel.com');
  console.log('   Password: password123');
}
