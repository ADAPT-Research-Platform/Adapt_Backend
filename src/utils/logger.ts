import winston from 'winston';
import path from 'path';

// Define log directory
const logDir = path.join(__dirname, '..', 'logs');

// Create a Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf(({ level, message, timestamp }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [
        // Write all logs to file
        new winston.transports.File({
            filename: path.join(logDir, `app_${new Date().toISOString().split('T')[0]}.log`),
        }),
        // Write to console as well
        new winston.transports.Console(),
    ],
});

// Export the logger
export default logger;
