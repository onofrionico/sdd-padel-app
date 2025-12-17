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
exports.Tournament = void 0;
const typeorm_1 = require("typeorm");
const association_entity_1 = require("../../associations/entities/association.entity");
const tournament_registration_entity_1 = require("./tournament-registration.entity");
const tournament_match_entity_1 = require("./tournament-match.entity");
const tournament_team_entity_1 = require("./tournament-team.entity");
let Tournament = class Tournament {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.Tournament = Tournament;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tournament.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tournament.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Tournament.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Tournament.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Tournament.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Tournament.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], Tournament.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Tournament.prototype, "settings", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Tournament.prototype, "isPublic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Tournament.prototype, "associationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => association_entity_1.Association, association => association.tournaments, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'associationId' }),
    __metadata("design:type", association_entity_1.Association)
], Tournament.prototype, "association", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tournament_registration_entity_1.TournamentRegistration, registration => registration.tournament),
    __metadata("design:type", Array)
], Tournament.prototype, "registrations", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tournament_match_entity_1.TournamentMatch, match => match.tournament),
    __metadata("design:type", Array)
], Tournament.prototype, "matches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tournament_team_entity_1.TournamentTeam, team => team.tournament),
    __metadata("design:type", Array)
], Tournament.prototype, "teams", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Tournament.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Tournament.prototype, "updatedAt", void 0);
exports.Tournament = Tournament = __decorate([
    (0, typeorm_1.Entity)('tournaments'),
    __metadata("design:paramtypes", [Object])
], Tournament);
//# sourceMappingURL=tournament.entity.js.map