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
exports.CreateTournamentRequestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const tournament_entity_1 = require("../entities/tournament.entity");
class TournamentSettingsDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TournamentSettingsDto.prototype, "maxTeams", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], TournamentSettingsDto.prototype, "minTeams", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], TournamentSettingsDto.prototype, "teamSize", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], TournamentSettingsDto.prototype, "categoryRange", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], TournamentSettingsDto.prototype, "pointsDistribution", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [String] }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], TournamentSettingsDto.prototype, "tiebreakers", void 0);
class CreateTournamentRequestDto {
    constructor() {
        this.status = tournament_entity_1.TournamentStatus.UPCOMING;
        this.isPublic = false;
    }
}
exports.CreateTournamentRequestDto = CreateTournamentRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTournamentRequestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTournamentRequestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreateTournamentRequestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreateTournamentRequestDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tournament_entity_1.TournamentStatus, default: tournament_entity_1.TournamentStatus.UPCOMING }),
    (0, class_validator_1.IsEnum)(tournament_entity_1.TournamentStatus),
    __metadata("design:type", String)
], CreateTournamentRequestDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: tournament_entity_1.TournamentType }),
    (0, class_validator_1.IsEnum)(tournament_entity_1.TournamentType),
    __metadata("design:type", String)
], CreateTournamentRequestDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: TournamentSettingsDto }),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => TournamentSettingsDto),
    __metadata("design:type", TournamentSettingsDto)
], CreateTournamentRequestDto.prototype, "settings", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ default: false }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTournamentRequestDto.prototype, "isPublic", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateTournamentRequestDto.prototype, "associationId", void 0);
//# sourceMappingURL=create-tournament-request.dto.js.map