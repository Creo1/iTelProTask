import express from 'express';
import passport from 'passport';

import AuthenticationController from './controllers/authentication';
import passportService from './services/passport';

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

export default function (app) {

  const apiRoutes = express.Router(),
    authRoutes = express.Router();

  // Auth Routes
  apiRoutes.use('/auth', authRoutes);

// register and login for industry 


  authRoutes.post('/register', AuthenticationController.register); // BASE_URL: localhost:3000/api/auth/register
  authRoutes.post('/login', AuthenticationController.login); // BASE_URL: localhost:3000/api/auth/login

// CRUD operations for services

authRoutes.post('/addService',requireAuth, AuthenticationController.addService); // BASE_URL: localhost:3000/api/auth/addService
authRoutes.get('/getAllServices',requireAuth, AuthenticationController.getAllServices); // BASE_URL: localhost:3000/api/auth/getAllServices
authRoutes.put('/updateService',requireAuth, AuthenticationController.updateService); // BASE_URL: localhost:3000/api/auth/updateService
authRoutes.delete('/deleteService',requireAuth, AuthenticationController.deleteService); // BASE_URL: localhost:3000/api/auth/deleteService



  // Set url for API group routes
  app.use('/api', apiRoutes);
};
