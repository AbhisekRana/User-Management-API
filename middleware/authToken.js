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
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
function auth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bigtoken = req.headers.authorization;
        if (!bigtoken || !bigtoken.startsWith('Bearer ')) {
            res.status(400).json('No token');
        }
        else {
            const token = bigtoken.split(' ')[1];
            const key = process.env.secret_key;
            if (key) {
                try {
                    const decode = jsonwebtoken_1.default.verify(token, key);
                    const { name } = decode;
                    req.user = name;
                    next();
                }
                catch (error) {
                    res.status(400).json(error);
                }
            }
            else {
                res.status(400).json('No JWT KEY has been set');
            }
        }
    });
}
exports.auth = auth;
