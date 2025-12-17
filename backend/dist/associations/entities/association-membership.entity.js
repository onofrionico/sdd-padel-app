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
exports.AssociationMembership = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const association_entity_1 = require("./association.entity");
let AssociationMembership = class AssociationMembership {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.AssociationMembership = AssociationMembership;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssociationMembership.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.associationMemberships, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], AssociationMembership.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssociationMembership.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => association_entity_1.Association, association => association.members, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'associationId' }),
    __metadata("design:type", association_entity_1.Association)
], AssociationMembership.prototype, "association", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AssociationMembership.prototype, "associationId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], AssociationMembership.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], AssociationMembership.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssociationMembership.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssociationMembership.prototype, "joinedAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssociationMembership.prototype, "updatedAt", void 0);
exports.AssociationMembership = AssociationMembership = __decorate([
    (0, typeorm_1.Entity)('association_memberships'),
    __metadata("design:paramtypes", [Object])
], AssociationMembership);
//# sourceMappingURL=association-membership.entity.js.map