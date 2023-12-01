"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtAuthenticate_1 = require("../middleware/jwtAuthenticate");
const noteController_1 = require("../controller/noteController");
// implementation start here
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
/* GET NOTES listing. */
router.get("/", noteController_1.getNoteFunction);
// creating a new note
router.post("/", jwtAuthenticate_1.authenticate, noteController_1.createNewNoteFunction);
exports.default = router;
