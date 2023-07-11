"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uroutes = void 0;
const user_1 = require("../controllers/user");
const authToken_1 = require("../middleware/authToken");
function uroutes(app) {
    app.post('/register', user_1.registerUser);
    app.post('/login', user_1.loginUser);
    app.get('/profile', authToken_1.auth, user_1.userProfile);
}
exports.uroutes = uroutes;
