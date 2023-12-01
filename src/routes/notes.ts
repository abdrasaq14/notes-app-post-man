
import express from "express";
import { authenticate } from "../middleware/jwtAuthenticate";
import { getNoteFunction, createNewNoteFunction } from "../controller/noteController";

// implementation start here
const router = express.Router();


router.use(express.json());
router.use(express.urlencoded({ extended: false }));

/* GET NOTES listing. */
router.get("/", getNoteFunction);
// creating a new note
router.post("/", authenticate, createNewNoteFunction);
export default router;
