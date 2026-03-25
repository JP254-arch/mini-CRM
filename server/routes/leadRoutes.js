import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import {
  createLead,
  getLeads,
  updateLead,
  deleteLead
} from "../controllers/leadController.js";

const router = express.Router();

router.post("/", protect, createLead);
router.get("/", protect, getLeads);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);

export default router;