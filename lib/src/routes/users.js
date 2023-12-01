"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getAllUser_1 = __importDefault(require("../controller/getAllUser"));
const signup_1 = __importDefault(require("../controller/signup"));
const login_1 = __importDefault(require("../controller/login"));
// implementation start here
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
// GET all users route
router.get("/", getAllUser_1.default);
// Creating new user
router.post("/signup", signup_1.default);
// new user login
router.post("/login", login_1.default);
exports.default = router;
