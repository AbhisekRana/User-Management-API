import express from 'express'
import { registerUser, loginUser, userProfile } from '../controllers/user'
import {auth} from '../middleware/authToken'

export function uroutes(app: express.Application) {
    app.post('/register', registerUser);
    app.post('/login', loginUser);
    app.get('/profile', auth, userProfile);
}