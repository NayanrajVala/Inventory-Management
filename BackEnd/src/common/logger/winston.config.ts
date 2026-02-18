import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.printf(
  ({ level, message, timestamp, context }) => {
    return `${timestamp} [${level}] ${context || 'App'}: ${message}`;
  },
);

export const winstonLogger = winston.createLogger({
  level: 'error',

  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
  ),

  transports: [
    // Console logging (development)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        logFormat,
      ),
    }),

    // Error logs file
    new winston.transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '14d',
    }),
  ],
});
