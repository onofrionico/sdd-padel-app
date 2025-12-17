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
exports.TournamentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tournament_entity_1 = require("./entities/tournament.entity");
const association_entity_1 = require("../associations/entities/association.entity");
let TournamentService = class TournamentService {
    constructor(tournamentRepository, associationRepository) {
        this.tournamentRepository = tournamentRepository;
        this.associationRepository = associationRepository;
    }
    async create(createTournamentDto) {
        const association = await this.associationRepository.findOne({
            where: { id: createTournamentDto.associationId },
        });
        if (!association) {
            throw new common_1.NotFoundException('Association not found');
        }
        const tournament = this.tournamentRepository.create({
            ...createTournamentDto,
            association,
            status: tournament_entity_1.TournamentStatus.UPCOMING,
        });
        return this.tournamentRepository.save(tournament);
    }
    async findAll(options = {}) {
        const [items, count] = await this.tournamentRepository.findAndCount({
            relations: ['association'],
            skip: options.skip,
            take: options.take,
            where: options.where,
        });
        return [items, count];
    }
    async findOne(id) {
        const tournament = await this.tournamentRepository.findOne({
            where: { id },
            relations: ['association'],
        });
        if (!tournament) {
            throw new common_1.NotFoundException(`Tournament with ID ${id} not found`);
        }
        return tournament;
    }
    async update(id, updateTournamentDto) {
        const tournament = await this.findOne(id);
        const updateData = { ...updateTournamentDto };
        if (updateTournamentDto.associationId) {
            const association = await this.associationRepository.findOne({
                where: { id: updateTournamentDto.associationId },
            });
            if (!association) {
                throw new common_1.NotFoundException('Association not found');
            }
            updateData.association = association;
            delete updateData.associationId;
        }
        if (updateTournamentDto.type && updateTournamentDto.type !== tournament.type) {
        }
        await this.tournamentRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.tournamentRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Tournament with ID ${id} not found`);
        }
    }
    async updateStatus(id, status) {
        const tournament = await this.findOne(id);
        tournament.status = status;
        return this.tournamentRepository.save(tournament);
    }
    async hasMatches(tournamentId) {
        const result = await this.tournamentRepository
            .createQueryBuilder('tournament')
            .leftJoin('tournament.matches', 'match')
            .where('tournament.id = :id', { id: tournamentId })
            .andWhere('match.id IS NOT NULL')
            .getCount();
        return result > 0;
    }
};
exports.TournamentService = TournamentService;
exports.TournamentService = TournamentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tournament_entity_1.Tournament)),
    __param(1, (0, typeorm_1.InjectRepository)(association_entity_1.Association)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TournamentService);
//# sourceMappingURL=tournament.service.js.map