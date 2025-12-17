"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const winston = __importStar(require("winston"));
const winston_daily_rotate_file_1 = __importDefault(require("winston-daily-rotate-file"));
const config_1 = require("@nestjs/config");
const { combine, timestamp, printf, colorize, json } = winston.format;
let LoggerService = class LoggerService {
    constructor(configService) {
        this.configService = configService;
        this.service = this.configService.get('SERVICE_NAME') || 'padel-tournament';
        this.initializeLogger();
    }
    initializeLogger() {
        const logFormat = printf(({ level, message, timestamp, context, trace }) => {
            return `${timestamp} [${this.service}] ${level}: ${message} ${context ? JSON.stringify(context) : ''} ${trace ? '\n' + trace : ''}`;
        });
        const transports = [
            new winston_daily_rotate_file_1.default({
                filename: 'logs/error-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                level: 'error',
                maxSize: '20m',
                maxFiles: '14d',
            }),
            new winston_daily_rotate_file_1.default({
                filename: 'logs/combined-%DATE%.log',
                datePattern: 'YYYY-MM-DD',
                maxSize: '20m',
                maxFiles: '14d',
            }),
        ];
        if (this.configService.get('NODE_ENV') !== 'production') {
            transports.push(new winston.transports.Console({
                format: combine(colorize(), logFormat),
            }));
        }
        this.logger = winston.createLogger({
            level: this.configService.get('LOG_LEVEL') || 'info',
            format: combine(timestamp(), json()),
            defaultMeta: { service: this.service },
            transports,
        });
    }
    log(message, context) {
        this.logger.info(message, { context });
    }
    error(message, trace, context) {
        this.logger.error(message, { trace, context });
    }
    warn(message, context) {
        this.logger.warn(message, { context });
    }
    debug(message, context) {
        if (this.logger.levels['debug'] <= this.logger.levels[this.logger.level]) {
            this.logger.debug(message, { context });
        }
    }
    verbose(message, context) {
        if (this.logger.levels['verbose'] <= this.logger.levels[this.logger.level]) {
            this.logger.verbose(message, { context });
        }
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggerService);
//# sourceMappingURL=logger.service.js.map