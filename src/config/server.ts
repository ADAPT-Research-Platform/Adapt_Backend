import cors from 'cors';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import createHttpError from 'http-errors';

import path from 'path';

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

  app.use(`/${process.env.API_ROUTES_PREFIX}`, apiRoutes);
  app.get('/*', (req, res) => {
    throw createHttpError(404, 'Resource Not Found');
  });

  app.use(errorHandler);

  return app;
};

export default createServer;
