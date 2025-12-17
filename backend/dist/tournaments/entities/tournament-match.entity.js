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
exports.TournamentMatch = void 0;
const typeorm_1 = require("typeorm");
const tournament_entity_1 = require("./tournament.entity");
const tournament_team_entity_1 = require("./tournament-team.entity");
let TournamentMatch = class TournamentMatch {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.TournamentMatch = TournamentMatch;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TournamentMatch.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], TournamentMatch.prototype, "tournamentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tournament_entity_1.Tournament, tournament => tournament.matches, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'tournamentId' }),
    __metadata("design:type", tournament_entity_1.Tournament)
], TournamentMatch.prototype, "tournament", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], TournamentMatch.prototype, "round", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], TournamentMatch.prototype, "matchNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], TournamentMatch.prototype, "homeTeamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tournament_team_entity_1.TournamentTeam, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'homeTeamId' }),
    __metadata("design:type", Object)
], TournamentMatch.prototype, "homeTeam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], TournamentMatch.prototype, "awayTeamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tournament_team_entity_1.TournamentTeam, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'awayTeamId' }),
    __metadata("design:type", Object)
], TournamentMatch.prototype, "awayTeam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: 'scheduled' }),
    __metadata("design:type", String)
], TournamentMatch.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], TournamentMatch.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TournamentMatch.prototype, "scheduledTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], TournamentMatch.prototype, "courtId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], TournamentMatch.prototype, "winnerTeamId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tournament_team_entity_1.TournamentTeam, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'winnerTeamId' }),
    __metadata("design:type", Object)
], TournamentMatch.prototype, "winnerTeam", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TournamentMatch.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TournamentMatch.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TournamentMatch.prototype, "updatedAt", void 0);
exports.TournamentMatch = TournamentMatch = __decorate([
    (0, typeorm_1.Entity)('tournament_matches'),
    __metadata("design:paramtypes", [Object])
], TournamentMatch);
//# sourceMappingURL=tournament-match.entity.js.map