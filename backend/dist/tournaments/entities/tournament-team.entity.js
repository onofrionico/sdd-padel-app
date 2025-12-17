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
exports.TournamentTeam = void 0;
const typeorm_1 = require("typeorm");
const tournament_entity_1 = require("./tournament.entity");
const tournament_registration_entity_1 = require("./tournament-registration.entity");
let TournamentTeam = class TournamentTeam {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.TournamentTeam = TournamentTeam;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TournamentTeam.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TournamentTeam.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TournamentTeam.prototype, "tournamentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tournament_entity_1.Tournament, tournament => tournament.teams, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tournamentId' }),
    __metadata("design:type", tournament_entity_1.Tournament)
], TournamentTeam.prototype, "tournament", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('TournamentPlayer', 'team', { cascade: true }),
    __metadata("design:type", Array)
], TournamentTeam.prototype, "players", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tournament_registration_entity_1.TournamentRegistration, registration => registration.team),
    __metadata("design:type", Array)
], TournamentTeam.prototype, "registrations", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TournamentTeam.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TournamentTeam.prototype, "matchesWon", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TournamentTeam.prototype, "matchesLost", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TournamentTeam.prototype, "setsWon", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TournamentTeam.prototype, "setsLost", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TournamentTeam.prototype, "gamesWon", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], TournamentTeam.prototype, "gamesLost", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TournamentTeam.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TournamentTeam.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", Object)
], TournamentTeam.prototype, "seed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], TournamentTeam.prototype, "isEliminated", void 0);
exports.TournamentTeam = TournamentTeam = __decorate([
    (0, typeorm_1.Entity)('tournament_teams'),
    __metadata("design:paramtypes", [Object])
], TournamentTeam);
//# sourceMappingURL=tournament-team.entity.js.map