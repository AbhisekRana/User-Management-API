import { Request, Response } from 'express';
require('express-async-errors');
require('dotenv').config()
import bcrypt from 'bcryptjs'
import { pool } from '../db/connect'
import jwt from 'jsonwebtoken'

export async function registerUser(req: Request, res: Response) {
    const { Username, Password } = req.body
    if (!Username || !Password) {
        res.status(400).json('Please provide a Name and Password')
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(Password, salt)
    const query: string = 'INSERT INTO users (name,password) VALUES ($1,$2) returning *'
    const user = await pool.query(query, [Username, hashedPassword])
    const key = process.env.secret_key
    if (key) {
        const token: string = jwt.sign({ name: Username }, key)
    }
    else {
        res.status(400).json('No JWT KEY has been set')
    }
    res.status(200).json(user.rows[0])
}

export async function loginUser(req: Request, res: Response) {
    const { Username, Password } = req.body
    if (!Username || !Password) {
        res.status(404).json('Provide a Username and Password')
    }
    const query: string = 'SELECT password FROM users WHERE name = $1'
    const user = await pool.query(query, [Username])
    if (!user) {
        res.status(400).json('No User Exists')
    }
    const check = await bcrypt.compare(Password, user.rows[0].password)
    if (!check) {
        res.status(400).json('Wrong Password')
    }
    const key = process.env.secret_key
    if (key) {
        const token = jwt.sign({ name: Username }, key)
        res.status(200).json(token)
    }
    else {
        res.status(400).json('No JWT KEY has been set')
    }
}

export async function userProfile(req: Request, res: Response) {
    res.status(200).json(req.user)
}