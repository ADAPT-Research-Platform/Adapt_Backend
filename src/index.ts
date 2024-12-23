import * as dotenv from 'dotenv';
import 'reflect-metadata';
dotenv.config();

import createServer from './config/server';
import logger from './logger';
import { AppDataSource } from './data-source';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || '8080';

const app = createServer();

AppDataSource.initialize()
    .then(() => {
        app.listen({ host, port }, () => {
            logger.info('============================================================================================');
            logger.info(`Server is started at http://${host}:${port}`);
        });
    })
    .catch(logger.error);