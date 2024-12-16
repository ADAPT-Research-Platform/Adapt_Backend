import cors from 'cors';
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import createHttpError from 'http-errors';

import session from './session';
import { errorHandler } from '../middlewares/errorHandler';
import passport from './passport';
import apiRoutes from '../routes/api';

const createServer = () => {
  const app = express();

/*   const corsOptions = {
    origin: process.env.CORS_ORIGIN_ALLOWED?.split(',') || '*',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }; */

  app.use(cors({
    origin: process.env.CORS_ORIGIN_ALLOWED || '*', // Allow all origins or specify allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  }));

  app.use(morgan('dev'));
 // app.use(cors(corsOptions));
  app.use(urlencoded({ extended: true }));
  app.use(json());
  app.use(helmet());
  app.set('json spaces', 2);

  app.use(session);

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(`/${process.env.API_ROUTES_PREFIX}`, apiRoutes);
  app.get('/*', (req, res) => {
    throw createHttpError(404, 'Resource Not Found');
  });

  app.use(errorHandler);

  return app;
};

export default createServer;
