"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
        username: process.env.DATABASE_USERNAME || 'postgres',
        password: process.env.DATABASE_PASSWORD || 'postgres',
        database: process.env.DATABASE_NAME || 'padel_tournament',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
});
//# sourceMappingURL=configuration.js.map