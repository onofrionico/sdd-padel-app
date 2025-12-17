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
exports.Notification = exports.NotificationStatus = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var NotificationType;
(function (NotificationType) {
    NotificationType["TOURNAMENT_INVITATION"] = "tournament_invitation";
    NotificationType["TEAM_INVITATION"] = "team_invitation";
    NotificationType["MATCH_SCHEDULED"] = "match_scheduled";
    NotificationType["MATCH_RESULT"] = "match_result";
    NotificationType["TOURNAMENT_UPDATE"] = "tournament_update";
    NotificationType["ASSOCIATION_INVITATION"] = "association_invitation";
    NotificationType["GENERAL"] = "general";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationStatus;
(function (NotificationStatus) {
    NotificationStatus["UNREAD"] = "unread";
    NotificationStatus["READ"] = "read";
    NotificationStatus["ARCHIVED"] = "archived";
})(NotificationStatus || (exports.NotificationStatus = NotificationStatus = {}));
let Notification = class Notification {
    constructor(partial) {
        Object.assign(this, partial);
    }
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.UNREAD }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Notification.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.notifications, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Notification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Notification.prototype, "isRead", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], Notification.prototype, "readAt", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications'),
    __metadata("design:paramtypes", [Object])
], Notification);
//# sourceMappingURL=notification.entity.js.map