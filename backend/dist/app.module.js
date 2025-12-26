"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const tournaments_module_1 = require("./tournaments/tournaments.module");
const associations_module_1 = require("./associations/associations.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const notifications_module_1 = require("./notifications/notifications.module");
const rankings_module_1 = require("./rankings/rankings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DATABASE_HOST', 'localhost'),
                    port: +configService.get('DATABASE_PORT', 5432),
                    username: configService.get('DATABASE_USERNAME', 'postgres'),
                    password: configService.get('DATABASE_PASSWORD', 'agusjgdf10'),
                    database: configService.get('DATABASE_NAME', 'padel_tournament'),
                    autoLoadEntities: true,
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: process.env.NODE_ENV !== 'production',
                    logging: process.env.NODE_ENV !== 'production',
                }),
                inject: [config_1.ConfigService],
            }),
            tournaments_module_1.TournamentsModule,
            associations_module_1.AssociationsModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            notifications_module_1.NotificationsModule,
            rankings_module_1.RankingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map