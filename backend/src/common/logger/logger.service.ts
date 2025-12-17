import { Injectable, Scope } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@nestjs/config';

const { combine, timestamp, printf, colorize, json } = winston.format;

type LogLevel = 'error' | 'warn' | 'info' | 'debug' | 'verbose';

interface LogEntry {
  level: string;
  message: string;
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private logger: winston.Logger;
  private service: string;

  constructor(private configService: ConfigService) {
    this.service = this.configService.get('SERVICE_NAME') || 'padel-tournament';
    this.initializeLogger();
  }

  private initializeLogger() {
    const logFormat = printf(({ level, message, timestamp, context, trace }) => {
      return `${timestamp} [${this.service}] ${level}: ${message} ${
        context ? JSON.stringify(context) : ''
      } ${trace ? '\n' + trace : ''}`;
    });

    const transports: winston.transport[] = [
      new DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '14d',
      }) as winston.transport,
      new DailyRotateFile({
        filename: 'logs/combined-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
      }) as winston.transport,
    ];

    if (this.configService.get('NODE_ENV') !== 'production') {
      transports.push(
        new winston.transports.Console({
          format: combine(colorize(), logFormat),
        })
      );
    }

    this.logger = winston.createLogger({
      level: this.configService.get('LOG_LEVEL') || 'info',
      format: combine(timestamp(), json()),
      defaultMeta: { service: this.service },
      transports,
    });
  }

  log(message: string, context?: Record<string, any>) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: Record<string, any>) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: Record<string, any>) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: Record<string, any>) {
    if (this.logger.levels['debug'] <= this.logger.levels[this.logger.level as LogLevel]) {
      this.logger.debug(message, { context });
    }
  }

  verbose(message: string, context?: Record<string, any>) {
    if (this.logger.levels['verbose'] <= this.logger.levels[this.logger.level as LogLevel]) {
      this.logger.verbose(message, { context });
    }
  }
}
