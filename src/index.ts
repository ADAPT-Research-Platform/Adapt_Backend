import * as dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

import * as fs from 'node:fs';
import * as https from 'node:https';
import path from 'path';

import createServer from './config/server';
import logger from './logger';
import { AppDataSource } from './data-source';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8080';

const app = createServer();

// Load SSL certificate and private key
const options = {
  key: fs.readFileSync(path.join(process.cwd(), 'ssl/server.key')),
  cert: fs.readFileSync(path.join(process.cwd(), 'ssl/certificate.crt')),
};

// If development mode, don't use HTTPS
if (process.env.NODE_ENV === 'production') {
  AppDataSource.initialize()
    .then(() => {
      // Start HTTPS server
      https.createServer(options, app).listen({ host, port }, () => {
        logger.info(
          '============================================================================================'
        );
        logger.info(`Server is started at https://${host}:${port}`);
      });
    })
    .catch(logger.error);
} else {
  AppDataSource.initialize()
    .then(() => {
      // Start HTTP server
      app.listen({ host, port }, () => {
        logger.info(
          '============================================================================================'
        );
        logger.info(`Server is started at http://${host}:${port}`);
      });
    })
    .catch(logger.error);
}
