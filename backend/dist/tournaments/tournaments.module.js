"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tournament_entity_1 = require("./entities/tournament.entity");
const tournament_controller_1 = require("./tournament.controller");
const tournament_service_1 = require("./tournament.service");
const association_entity_1 = require("../associations/entities/association.entity");
const tournament_team_entity_1 = require("./entities/tournament-team.entity");
const tournament_player_entity_1 = require("./entities/tournament-player.entity");
const tournament_registration_entity_1 = require("./entities/tournament-registration.entity");
const tournament_match_entity_1 = require("./entities/tournament-match.entity");
const enrollment_service_1 = require("./enrollment.service");
const enrollment_controller_1 = require("./enrollment.controller");
const associations_module_1 = require("../associations/associations.module");
const notifications_module_1 = require("../notifications/notifications.module");
const tournament_matches_controller_1 = require("./tournament-matches.controller");
const tournament_matches_service_1 = require("./tournament-matches.service");
let TournamentsModule = class TournamentsModule {
};
exports.TournamentsModule = TournamentsModule;
exports.TournamentsModule = TournamentsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                tournament_entity_1.Tournament,
                association_entity_1.Association,
                tournament_team_entity_1.TournamentTeam,
                tournament_player_entity_1.TournamentPlayer,
                tournament_registration_entity_1.TournamentRegistration,
                tournament_match_entity_1.TournamentMatch,
            ]),
            associations_module_1.AssociationsModule,
            notifications_module_1.NotificationsModule,
        ],
        controllers: [tournament_controller_1.TournamentController, enrollment_controller_1.EnrollmentController, tournament_matches_controller_1.TournamentMatchesController],
        providers: [tournament_service_1.TournamentService, enrollment_service_1.EnrollmentService, tournament_matches_service_1.TournamentMatchesService],
        exports: [tournament_service_1.TournamentService],
    })
], TournamentsModule);
//# sourceMappingURL=tournaments.module.js.map