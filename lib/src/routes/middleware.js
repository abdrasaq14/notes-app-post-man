"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
// Middleware to authenticate users
const authenticateUser = (req, res, next) => {
    var _a;
    // Check if the user is authenticated by checking the session
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.userId)) {
        return res.status(401).send('Unauthorized');
    }
    next();
};
exports.authenticateUser = authenticateUser;
