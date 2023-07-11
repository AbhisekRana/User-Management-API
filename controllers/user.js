"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userProfile = exports.loginUser = exports.registerUser = void 0;
require('express-async-errors');
require('dotenv').config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const connect_1 = require("../db/connect");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function registerUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Username, Password } = req.body;
        if (!Username || !Password) {
            res.status(400).json('Please provide a Name and Password');
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(Password, salt);
        const query = 'INSERT INTO users (name,password) VALUES ($1,$2) returning *';
        const user = yield connect_1.pool.query(query, [Username, hashedPassword]);
        const key = process.env.secret_key;
        if (key) {
            const token = jsonwebtoken_1.default.sign({ name: Username }, key);
        }
        else {
            res.status(400).json('No JWT KEY has been set');
        }
        res.status(200).json(user.rows[0]);
    });
}
exports.registerUser = registerUser;
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Username, Password } = req.body;
        if (!Username || !Password) {
            res.status(404).json('Provide a Username and Password');
        }
        const query = 'SELECT password FROM users WHERE name = $1';
        const user = yield connect_1.pool.query(query, [Username]);
        if (!user) {
            res.status(400).json('No User Exists');
        }
        const check = yield bcryptjs_1.default.compare(Password, user.rows[0].password);
        if (!check) {
            res.status(400).json('Wrong Password');
        }
        const key = process.env.secret_key;
        if (key) {
            const token = jsonwebtoken_1.default.sign({ name: Username }, key);
            res.status(200).json(token);
        }
        else {
            res.status(400).json('No JWT KEY has been set');
        }
    });
}
exports.loginUser = loginUser;
function userProfile(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.status(200).json(req.user);
    });
}
exports.userProfile = userProfile;
