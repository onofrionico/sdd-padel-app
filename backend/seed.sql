-- Script de seed para la base de datos de Pádel Tournament
-- Ejecutar con: psql -U postgres -d padel_tournament -f seed.sql

-- Limpiar datos existentes
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE tournament_matches CASCADE;
TRUNCATE TABLE tournament_registrations CASCADE;
TRUNCATE TABLE tournament_players CASCADE;
TRUNCATE TABLE tournament_teams CASCADE;
TRUNCATE TABLE tournaments CASCADE;
TRUNCATE TABLE seasons CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE association_memberships CASCADE;
TRUNCATE TABLE associations CASCADE;
TRUNCATE TABLE users CASCADE;

-- 1. Crear Usuarios (password: password123 hasheado con bcrypt)
INSERT INTO users (id, email, password, "firstName", "lastName", role, gender, "phoneNumber", "dateOfBirth", "playingHand", "playingStyle", "isVerified", "createdAt", "updatedAt") VALUES
('a1111111-1111-1111-1111-111111111111', 'admin@padel.com', '$2b$10$YoswhTC5xA60ZTZoheLs3Osistk9AxsrsImPIZmepO6HDzJME0j0m', 'Admin', 'Sistema', 'admin', 'male', '+54 11 1234-5678', '1985-05-15', 'right', 'all_around', true, NOW(), NOW()),
('a2222222-2222-2222-2222-222222222222', 'juan.perez@email.com', '$2b$10$YoswhTC5xA60ZTZoheLs3Osistk9AxsrsImPIZmepO6HDzJME0j0m', 'Juan', 'Pérez', 'organizer', 'male', '+54 11 2345-6789', '1990-03-20', 'right', 'offensive', true, NOW(), NOW()),
('a3333333-3333-3333-3333-333333333333', 'maria.garcia@email.com', '$2b$10$YoswhTC5xA60ZTZoheLs3Osistk9AxsrsImPIZmepO6HDzJME0j0m', 'María', 'García', 'user', 'female', '+54 11 3456-7890', '1992-07-10', 'left', 'defensive', true, NOW(), NOW()),
('a4444444-4444-4444-4444-444444444444', 'carlos.rodriguez@email.com', '$2b$10$YoswhTC5xA60ZTZoheLs3Osistk9AxsrsImPIZmepO6HDzJME0j0m', 'Carlos', 'Rodríguez', 'user', 'male', '+54 11 4567-8901', '1988-11-25', 'right', 'all_around', true, NOW(), NOW()),
('a5555555-5555-5555-5555-555555555555', 'ana.martinez@email.com', '$2b$10$YoswhTC5xA60ZTZoheLs3Osistk9AxsrsImPIZmepO6HDzJME0j0m', 'Ana', 'Martínez', 'user', 'female', '+54 11 5678-9012', '1995-02-14', 'right', 'offensive', true, NOW(), NOW()),
('a6666666-6666-6666-6666-666666666666', 'pedro.lopez@email.com', '$2b$10$YoswhTC5xA60ZTZoheLs3Osistk9AxsrsImPIZmepO6HDzJME0j0m', 'Pedro', 'López', 'user', 'male', '+54 11 6789-0123', '1991-09-05', 'left', 'defensive', true, NOW(), NOW()),
('a7777777-7777-7777-7777-777777777777', 'laura.fernandez@email.com', '$2b$10$YoswhTC5xA60ZTZoheLs3Osistk9AxsrsImPIZmepO6HDzJME0j0m', 'Laura', 'Fernández', 'user', 'female', '+54 11 7890-1234', '1993-06-18', 'right', 'all_around', true, NOW(), NOW()),
('a8888888-8888-8888-8888-888888888888', 'diego.sanchez@email.com', '$2b$10$YoswhTC5xA60ZTZoheLs3Osistk9AxsrsImPIZmepO6HDzJME0j0m', 'Diego', 'Sánchez', 'user', 'male', '+54 11 8901-2345', '1989-12-30', 'right', 'offensive', true, NOW(), NOW());

-- 2. Crear Asociaciones
INSERT INTO associations (id, name, description, "logoUrl", website, "isActive", "pointsByRound", "createdAt", "updatedAt") VALUES
('b1111111-1111-1111-1111-111111111111', 'Asociación de Pádel de Buenos Aires', 'Principal asociación de pádel de la Ciudad de Buenos Aires', 'https://example.com/logos/apba.png', 'https://apba.com.ar', true, '{"final": 100, "semifinal": 75, "cuartos": 50, "octavos": 25, "primera_ronda": 10}', NOW(), NOW()),
('b2222222-2222-2222-2222-222222222222', 'Club Náutico San Isidro', 'Club deportivo con canchas de pádel de primer nivel', 'https://example.com/logos/cnsi.png', 'https://cnsi.com.ar', true, '{"final": 80, "semifinal": 60, "cuartos": 40, "octavos": 20}', NOW(), NOW()),
('b3333333-3333-3333-3333-333333333333', 'Federación Argentina de Pádel', 'Federación nacional que regula el pádel en Argentina', 'https://example.com/logos/fap.png', 'https://fap.org.ar', true, '{"final": 150, "semifinal": 100, "cuartos": 75, "octavos": 50, "primera_ronda": 25}', NOW(), NOW());

-- 3. Crear Membresías
INSERT INTO association_memberships (id, "userId", "associationId", role, category, points, "joinedAt", "updatedAt") VALUES
('c1111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'admin', 1, 500, NOW(), NOW()),
('c2222222-2222-2222-2222-222222222222', 'a2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'organizer', 2, 350, NOW(), NOW()),
('c3333333-3333-3333-3333-333333333333', 'a3333333-3333-3333-3333-333333333333', 'b1111111-1111-1111-1111-111111111111', 'member', 3, 280, NOW(), NOW()),
('c4444444-4444-4444-4444-444444444444', 'a4444444-4444-4444-4444-444444444444', 'b1111111-1111-1111-1111-111111111111', 'member', 2, 420, NOW(), NOW()),
('c5555555-5555-5555-5555-555555555555', 'a5555555-5555-5555-5555-555555555555', 'b2222222-2222-2222-2222-222222222222', 'member', 4, 180, NOW(), NOW()),
('c6666666-6666-6666-6666-666666666666', 'a6666666-6666-6666-6666-666666666666', 'b2222222-2222-2222-2222-222222222222', 'member', 3, 310, NOW(), NOW()),
('c7777777-7777-7777-7777-777777777777', 'a7777777-7777-7777-7777-777777777777', 'b3333333-3333-3333-3333-333333333333', 'member', 2, 390, NOW(), NOW()),
('c8888888-8888-8888-8888-888888888888', 'a8888888-8888-8888-8888-888888888888', 'b3333333-3333-3333-3333-333333333333', 'member', 1, 550, NOW(), NOW());

-- 4. Crear Categorías
INSERT INTO categories (id, name, level, "minPoints", "maxPoints", description, "isActive", "associationId", "createdAt", "updatedAt") VALUES
('d1111111-1111-1111-1111-111111111111', 'Primera', 'professional', 500, 1000, 'Categoría profesional de máximo nivel', true, 'b1111111-1111-1111-1111-111111111111', NOW(), NOW()),
('d2222222-2222-2222-2222-222222222222', 'Segunda', 'advanced', 300, 499, 'Categoría avanzada', true, 'b1111111-1111-1111-1111-111111111111', NOW(), NOW()),
('d3333333-3333-3333-3333-333333333333', 'Tercera', 'intermediate', 150, 299, 'Categoría intermedia', true, 'b1111111-1111-1111-1111-111111111111', NOW(), NOW()),
('d4444444-4444-4444-4444-444444444444', 'Cuarta', 'beginner', 0, 149, 'Categoría principiante', true, 'b1111111-1111-1111-1111-111111111111', NOW(), NOW());

-- 5. Crear Temporadas
INSERT INTO seasons (id, "associationId", name, "startDate", "endDate", "createdAt", "updatedAt") VALUES
('e1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 'Temporada 2024', '2024-01-01', '2024-12-31', NOW(), NOW()),
('e2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 'Temporada 2025', '2025-01-01', '2025-12-31', NOW(), NOW()),
('e3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 'Temporada Verano 2024', '2024-12-01', '2025-03-31', NOW(), NOW());

-- 6. Crear Torneos
INSERT INTO tournaments (id, name, description, "startDate", "endDate", status, type, settings, "isPublic", "associationId", "createdAt", "updatedAt") VALUES
('f1111111-1111-1111-1111-111111111111', 'Torneo Apertura 2024', 'Torneo de apertura de la temporada 2024', '2024-03-15', '2024-03-17', 'completed', 'single_elimination', '{"maxTeams": 16, "minTeams": 8, "teamSize": 2, "categoryRange": {"min": 1, "max": 4}, "pointsDistribution": {"winner": 100, "finalist": 75, "semifinalist": 50, "quarterfinalist": 25}, "tiebreakers": ["head_to_head", "points_difference"]}', true, 'b1111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f2222222-2222-2222-2222-222222222222', 'Copa de Verano 2024', 'Torneo especial de verano', '2024-12-20', '2024-12-22', 'in_progress', 'groups_knockout', '{"maxTeams": 24, "minTeams": 12, "teamSize": 2, "categoryRange": {"min": 2, "max": 4}, "pointsDistribution": {"winner": 80, "finalist": 60, "semifinalist": 40, "quarterfinalist": 20}, "tiebreakers": ["head_to_head", "sets_difference"]}', true, 'b1111111-1111-1111-1111-111111111111', NOW(), NOW()),
('f3333333-3333-3333-3333-333333333333', 'Torneo Clausura 2025', 'Torneo de clausura de la temporada', '2025-11-10', '2025-11-12', 'registration_open', 'double_elimination', '{"maxTeams": 32, "minTeams": 16, "teamSize": 2, "categoryRange": {"min": 1, "max": 3}, "pointsDistribution": {"winner": 120, "finalist": 90, "semifinalist": 60, "quarterfinalist": 30}, "tiebreakers": ["head_to_head", "points_difference", "games_difference"]}', true, 'b1111111-1111-1111-1111-111111111111', NOW(), NOW());

-- 7. Crear Equipos
INSERT INTO tournament_teams (id, name, "tournamentId", points, "matchesWon", "matchesLost", "setsWon", "setsLost", "gamesWon", "gamesLost", seed, "isEliminated", "createdAt", "updatedAt") VALUES
('10000000-0000-0000-0000-000000000001', 'Los Cracks', 'f1111111-1111-1111-1111-111111111111', 6, 3, 0, 6, 1, 42, 28, '1', false, NOW(), NOW()),
('10000000-0000-0000-0000-000000000002', 'Pádel Masters', 'f1111111-1111-1111-1111-111111111111', 4, 2, 1, 5, 3, 38, 32, '2', false, NOW(), NOW()),
('10000000-0000-0000-0000-000000000003', 'Equipo Rojo', 'f2222222-2222-2222-2222-222222222222', 3, 1, 1, 3, 3, 30, 30, '3', false, NOW(), NOW()),
('10000000-0000-0000-0000-000000000004', 'Equipo Azul', 'f2222222-2222-2222-2222-222222222222', 2, 1, 1, 2, 3, 25, 28, '4', false, NOW(), NOW()),
('10000000-0000-0000-0000-000000000005', 'Los Invencibles', 'f3333333-3333-3333-3333-333333333333', 0, 0, 0, 0, 0, 0, 0, '1', false, NOW(), NOW()),
('10000000-0000-0000-0000-000000000006', 'Dream Team', 'f3333333-3333-3333-3333-333333333333', 0, 0, 0, 0, 0, 0, 0, '2', false, NOW(), NOW());

-- 8. Crear Jugadores de Torneo
INSERT INTO tournament_players (id, "userId", "teamId", category, "createdAt", "updatedAt") VALUES
('20000000-0000-0000-0000-000000000001', 'a3333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000001', 3, NOW(), NOW()),
('20000000-0000-0000-0000-000000000002', 'a4444444-4444-4444-4444-444444444444', '10000000-0000-0000-0000-000000000001', 2, NOW(), NOW()),
('20000000-0000-0000-0000-000000000003', 'a5555555-5555-5555-5555-555555555555', '10000000-0000-0000-0000-000000000002', 4, NOW(), NOW()),
('20000000-0000-0000-0000-000000000004', 'a6666666-6666-6666-6666-666666666666', '10000000-0000-0000-0000-000000000002', 3, NOW(), NOW()),
('20000000-0000-0000-0000-000000000005', 'a7777777-7777-7777-7777-777777777777', '10000000-0000-0000-0000-000000000003', 2, NOW(), NOW()),
('20000000-0000-0000-0000-000000000006', 'a8888888-8888-8888-8888-888888888888', '10000000-0000-0000-0000-000000000003', 1, NOW(), NOW()),
('20000000-0000-0000-0000-000000000007', 'a3333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000004', 3, NOW(), NOW()),
('20000000-0000-0000-0000-000000000008', 'a5555555-5555-5555-5555-555555555555', '10000000-0000-0000-0000-000000000004', 4, NOW(), NOW()),
('20000000-0000-0000-0000-000000000009', 'a4444444-4444-4444-4444-444444444444', '10000000-0000-0000-0000-000000000005', 2, NOW(), NOW()),
('20000000-0000-0000-0000-000000000010', 'a6666666-6666-6666-6666-666666666666', '10000000-0000-0000-0000-000000000005', 3, NOW(), NOW()),
('20000000-0000-0000-0000-000000000011', 'a7777777-7777-7777-7777-777777777777', '10000000-0000-0000-0000-000000000006', 2, NOW(), NOW()),
('20000000-0000-0000-0000-000000000012', 'a8888888-8888-8888-8888-888888888888', '10000000-0000-0000-0000-000000000006', 1, NOW(), NOW());

-- 9. Crear Registros de Torneo
INSERT INTO tournament_registrations (id, "tournamentId", "teamId", status, "rejectionReason", "registeredAt", "updatedAt") VALUES
('30000000-0000-0000-0000-000000000001', 'f1111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', 'approved', NULL, NOW(), NOW()),
('30000000-0000-0000-0000-000000000002', 'f1111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', 'approved', NULL, NOW(), NOW()),
('30000000-0000-0000-0000-000000000003', 'f2222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000003', 'approved', NULL, NOW(), NOW()),
('30000000-0000-0000-0000-000000000004', 'f2222222-2222-2222-2222-222222222222', '10000000-0000-0000-0000-000000000004', 'approved', NULL, NOW(), NOW()),
('30000000-0000-0000-0000-000000000005', 'f3333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000005', 'pending', NULL, NOW(), NOW()),
('30000000-0000-0000-0000-000000000006', 'f3333333-3333-3333-3333-333333333333', '10000000-0000-0000-0000-000000000006', 'pending', NULL, NOW(), NOW());

-- 10. Crear Partidos
INSERT INTO tournament_matches (id, "tournamentId", round, "matchNumber", "homeTeamId", "awayTeamId", status, score, "scheduledTime", "winnerTeamId", notes, "createdAt", "updatedAt") VALUES
('40000000-0000-0000-0000-000000000001', 'f1111111-1111-1111-1111-111111111111', 1, 1, '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'completed', '{"sets": [{"homeScore": 6, "awayScore": 4}, {"homeScore": 6, "awayScore": 3}], "winner": "home"}', '2024-03-15 10:00:00', '10000000-0000-0000-0000-000000000001', 'Partido muy reñido en el primer set', NOW(), NOW()),
('40000000-0000-0000-0000-000000000002', 'f1111111-1111-1111-1111-111111111111', 2, 1, '10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'completed', '{"sets": [{"homeScore": 7, "awayScore": 5}, {"homeScore": 6, "awayScore": 4}], "winner": "home"}', '2024-03-16 14:00:00', '10000000-0000-0000-0000-000000000001', 'Final del torneo', NOW(), NOW()),
('40000000-0000-0000-0000-000000000003', 'f2222222-2222-2222-2222-222222222222', 1, 1, '10000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000004', 'in_progress', '{"sets": [{"homeScore": 6, "awayScore": 4}, {"homeScore": 3, "awayScore": 5}]}', '2024-12-20 16:00:00', NULL, 'Partido en curso', NOW(), NOW()),
('40000000-0000-0000-0000-000000000004', 'f3333333-3333-3333-3333-333333333333', 1, 1, '10000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000006', 'scheduled', NULL, '2025-11-10 10:00:00', NULL, 'Primer partido del torneo', NOW(), NOW());

-- 11. Crear Notificaciones
INSERT INTO notifications (id, type, message, metadata, status, "userId", "isRead", "readAt", "createdAt") VALUES
('50000000-0000-0000-0000-000000000001', 'tournament_invitation', 'Has sido invitado al Torneo Apertura 2024', '{"tournamentId": "f1111111-1111-1111-1111-111111111111", "tournamentName": "Torneo Apertura 2024"}', 'read', 'a3333333-3333-3333-3333-333333333333', true, '2024-03-10 12:00:00', NOW()),
('50000000-0000-0000-0000-000000000002', 'match_scheduled', 'Tu partido está programado para el 20 de diciembre a las 16:00', '{"scheduledTime": "2024-12-20T16:00:00"}', 'unread', 'a7777777-7777-7777-7777-777777777777', false, NULL, NOW()),
('50000000-0000-0000-0000-000000000003', 'match_result', 'Resultado del partido: Los Cracks 2 - 0 Pádel Masters', '{"result": "win"}', 'read', 'a3333333-3333-3333-3333-333333333333', true, '2024-03-15 18:00:00', NOW()),
('50000000-0000-0000-0000-000000000004', 'tournament_update', 'El Torneo Clausura 2025 ha abierto inscripciones', '{"tournamentId": "f3333333-3333-3333-3333-333333333333"}', 'unread', 'a4444444-4444-4444-4444-444444444444', false, NULL, NOW()),
('50000000-0000-0000-0000-000000000005', 'association_invitation', 'Has sido invitado a unirte a la Asociación de Pádel de Buenos Aires', '{"associationId": "b1111111-1111-1111-1111-111111111111", "associationName": "Asociación de Pádel de Buenos Aires"}', 'archived', 'a5555555-5555-5555-5555-555555555555', true, '2024-01-15 10:00:00', NOW()),
('50000000-0000-0000-0000-000000000006', 'general', 'Bienvenido a la plataforma de torneos de pádel', '{}', 'read', 'a6666666-6666-6666-6666-666666666666', true, '2024-01-01 09:00:00', NOW());

-- Mostrar resumen
SELECT 'Seed completado exitosamente!' as mensaje;
SELECT 'Usuarios creados: ' || COUNT(*) FROM users;
SELECT 'Asociaciones creadas: ' || COUNT(*) FROM associations;
SELECT 'Membresías creadas: ' || COUNT(*) FROM association_memberships;
SELECT 'Categorías creadas: ' || COUNT(*) FROM categories;
SELECT 'Temporadas creadas: ' || COUNT(*) FROM seasons;
SELECT 'Torneos creados: ' || COUNT(*) FROM tournaments;
SELECT 'Equipos creados: ' || COUNT(*) FROM tournament_teams;
SELECT 'Jugadores creados: ' || COUNT(*) FROM tournament_players;
SELECT 'Registros creados: ' || COUNT(*) FROM tournament_registrations;
SELECT 'Partidos creados: ' || COUNT(*) FROM tournament_matches;
SELECT 'Notificaciones creadas: ' || COUNT(*) FROM notifications;
SELECT '' as separador;
SELECT 'Credenciales de prueba:' as info;
SELECT 'Email: admin@padel.com' as credencial;
SELECT 'Password: password123' as credencial;
SELECT 'NOTA: Debes actualizar el hash de password en el archivo SQL antes de ejecutar' as importante;
