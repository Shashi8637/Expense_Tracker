import express from "express";
import { addEntry, deleteEntries, editEntries, getAllEntries, getAllExpense, getIncomeEntities } from "../controllers/entryControllers.js";

const router = express.Router();

router.post("/addentries",addEntry);
router.get("/allentries",getAllEntries);
router.get("/getincomeentry",getIncomeEntities);
router.get("/getexpense",getAllExpense);
router.patch("/editentries/:id",editEntries);
router.delete("/deleteentries/:id",deleteEntries);

export default router;