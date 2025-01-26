import cors from 'cors';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import createHttpError from 'http-errors';
import path from 'path';

import swaggerJSDoc from 'swagger-jsdoc';

import swaggerUi from 'swagger-ui-express';

import session from './session';
import { errorHandler } from '../middlewares/errorHandler';
import passport from './passport';
import apiRoutes from '../routes/api';
import logger from '../logger';

const createServer = () => {
  const app = express();

  const corsOptions = {
    origin: process.env.CORS_ORIGIN_ALLOWED?.split(',') || '*', // Allow specified origins or all
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers allowed in requests
    exposedHeaders: ['Set-Cookie'], // Ensure cookies can be read by the client
  };  
  
  morgan.format(
    'plain',
    ':method :url :status :response-time ms - :res[content-length]'
  );
  app.use(
    morgan('plain', {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
  app.use(cors(corsOptions));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(helmet());
  app.set('json spaces', 2);

  app.use(session);

  app.use(passport.initialize());
  app.use(passport.session());

  // Serve static files from the "uploads" directory
  app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')));

  // Swagger configuration
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Documentation',
        version: '1.0.0',
        description: 'Documentation for the API',
      },
      servers: [
        {
          url: `http://${process.env.HOST}:${process.env.PORT}`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/routes/*.ts'],
  };

  const swaggerSpec = swaggerJSDoc(swaggerOptions);

  // Serve Swagger documentation
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, { explorer: true })
  );

  app.use(`/${process.env.API_ROUTES_PREFIX}`, apiRoutes);
  app.get('/*', (req, res) => {
    throw createHttpError(404, 'Resource Not Found');
  });

  app.use(errorHandler);

  return app;
};

export default createServer;
