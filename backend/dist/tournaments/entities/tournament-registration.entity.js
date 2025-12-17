"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentRegistration = void 0;
const typeorm_1 = require("typeorm");
const tournament_entity_1 = require("./tournament.entity");
const tournament_team_entity_1 = require("./tournament-team.entity");
let TournamentRegistration = class TournamentRegistration {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.TournamentRegistration = TournamentRegistration;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TournamentRegistration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TournamentRegistration.prototype, "tournamentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tournament_entity_1.Tournament, tournament => tournament.registrations, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tournamentId' }),
    __metadata("design:type", tournament_entity_1.Tournament)
], TournamentRegistration.prototype, "tournament", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TournamentRegistration.prototype, "teamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tournament_team_entity_1.TournamentTeam, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'teamId' }),
    __metadata("design:type", tournament_team_entity_1.TournamentTeam)
], TournamentRegistration.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'pending' }),
    __metadata("design:type", String)
], TournamentRegistration.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TournamentRegistration.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TournamentRegistration.prototype, "registeredAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TournamentRegistration.prototype, "updatedAt", void 0);
exports.TournamentRegistration = TournamentRegistration = __decorate([
    (0, typeorm_1.Entity)('tournament_registrations'),
    __metadata("design:paramtypes", [Object])
], TournamentRegistration);
//# sourceMappingURL=tournament-registration.entity.js.map