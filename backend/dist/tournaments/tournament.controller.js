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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TournamentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tournament_service_1 = require("./tournament.service");
const tournament_entity_1 = require("./entities/tournament.entity");
const create_tournament_request_dto_1 = require("./dto/create-tournament-request.dto");
const update_tournament_request_dto_1 = require("./dto/update-tournament-request.dto");
const swagger_2 = require("@nestjs/swagger");
class TournamentResponseDto extends tournament_entity_1.Tournament {
}
class TournamentListResponseDto {
}
__decorate([
    (0, swagger_2.ApiProperty)({ type: [tournament_entity_1.Tournament], description: 'Array of tournament items' }),
    __metadata("design:type", Array)
], TournamentListResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Total number of items across all pages' }),
    __metadata("design:type", Number)
], TournamentListResponseDto.prototype, "count", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Current page number (1-based)' }),
    __metadata("design:type", Number)
], TournamentListResponseDto.prototype, "page", void 0);
__decorate([
    (0, swagger_2.ApiProperty)({ description: 'Number of items per page' }),
    __metadata("design:type", Number)
], TournamentListResponseDto.prototype, "pageSize", void 0);
let TournamentController = class TournamentController {
    constructor(tournamentService) {
        this.tournamentService = tournamentService;
    }
    async create(createTournamentDto) {
        return this.tournamentService.create(createTournamentDto);
    }
    async findAll(page = 1, limit = 10, status) {
        if (page < 1) {
            throw new common_1.BadRequestException('Page must be greater than 0');
        }
        if (limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('Limit must be between 1 and 100');
        }
        const skip = (page - 1) * limit;
        const take = limit;
        const [items, totalCount] = await this.tournamentService.findAll({
            skip: (page - 1) * limit,
            take: limit,
            where: status ? { status } : {},
        });
        return {
            items,
            count: totalCount,
            page,
            pageSize: limit,
        };
    }
    async findOne(id) {
        return this.tournamentService.findOne(id);
    }
    async update(id, updateTournamentDto) {
        return this.tournamentService.update(id, updateTournamentDto);
    }
    async remove(id) {
        await this.tournamentService.remove(id);
        return { message: 'Tournament deleted successfully' };
    }
    async updateStatus(id, status) {
        if (!Object.values(tournament_entity_1.TournamentStatus).includes(status)) {
            throw new common_1.BadRequestException('Invalid status value');
        }
        return this.tournamentService.updateStatus(id, status);
    }
};
exports.TournamentController = TournamentController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Create a new tournament',
        description: 'Creates a new tournament with the provided details.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_tournament_request_dto_1.CreateTournamentRequestDto,
        description: 'Tournament creation data',
        examples: {
            basic: {
                summary: 'Basic tournament',
                value: {
                    name: 'Summer Padel Open',
                    description: 'Annual summer padel tournament',
                    startDate: '2024-07-15T10:00:00.000Z',
                    type: 'single_elimination',
                    settings: {
                        maxTeams: 16,
                        minTeams: 8,
                        teamSize: 2,
                        pointsDistribution: {
                            winner: 100,
                            finalist: 70,
                            semiFinalist: 50,
                        },
                    },
                    associationId: '550e8400-e29b-41d4-a716-446655440000',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The tournament has been successfully created.',
        type: TournamentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Association not found',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all tournaments',
        description: 'Retrieves a list of tournaments with optional pagination and filtering.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        type: Number,
        example: 1,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        type: Number,
        example: 10,
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: false,
        description: 'Filter by tournament status',
        enum: Object.values(tournament_entity_1.TournamentStatus),
        example: 'upcoming',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'List of tournaments',
        type: TournamentListResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid pagination parameters',
    }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get a tournament by ID',
        description: 'Retrieves detailed information about a specific tournament.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Tournament ID',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The tournament was found',
        type: TournamentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Tournament not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update a tournament',
        description: 'Updates an existing tournament with the provided data.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Tournament ID',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiBody)({
        type: update_tournament_request_dto_1.UpdateTournamentRequestDto,
        description: 'Tournament update data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The tournament was updated successfully',
        type: TournamentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Tournament or Association not found',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Delete a tournament',
        description: 'Deletes a tournament and all its related data.',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Tournament ID',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The tournament was deleted successfully',
        schema: {
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Tournament deleted successfully' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Tournament not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.FORBIDDEN,
        description: 'Not authorized to delete this tournament',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "remove", null);
__decorate([
    (0, common_1.Put)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Update tournament status',
        description: 'Updates the status of a tournament (e.g., from "upcoming" to "in_progress").',
    }),
    (0, swagger_1.ApiParam)({
        name: 'id',
        description: 'Tournament ID',
        format: 'uuid',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'status',
        required: true,
        description: 'New status for the tournament',
        enum: Object.values(tournament_entity_1.TournamentStatus),
        example: 'in_progress',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Tournament status was updated successfully',
        type: TournamentResponseDto,
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid status transition',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Tournament not found',
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CONFLICT,
        description: 'Status transition not allowed',
    }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TournamentController.prototype, "updateStatus", null);
exports.TournamentController = TournamentController = __decorate([
    (0, swagger_1.ApiTags)('Tournaments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tournaments'),
    (0, swagger_1.ApiExtraModels)(tournament_entity_1.Tournament, TournamentResponseDto, TournamentListResponseDto),
    __metadata("design:paramtypes", [tournament_service_1.TournamentService])
], TournamentController);
//# sourceMappingURL=tournament.controller.js.map