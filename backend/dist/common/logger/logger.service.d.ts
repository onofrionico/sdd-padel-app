import { ConfigService } from '@nestjs/config';
export declare class LoggerService {
    private configService;
    private logger;
    private service;
    constructor(configService: ConfigService);
    private initializeLogger;
    log(message: string, context?: Record<string, any>): void;
    error(message: string, trace?: string, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
    debug(message: string, context?: Record<string, any>): void;
    verbose(message: string, context?: Record<string, any>): void;
}
