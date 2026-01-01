
import { Router } from "express";
import { checkpointStorage } from "./storage";

const router = Router();

router.post("/checkpoints", async (req, res) => {
  try {
    const checkpoint = await checkpointStorage.createCheckpoint(req.body);
    res.status(201).json(checkpoint);
  } catch (error: any) {
    console.error("Create checkpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/checkpoints/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;
    const checkpoints = await checkpointStorage.getCheckpointsBySession(sessionId);
    res.json(checkpoints);
  } catch (error: any) {
    console.error("Get checkpoints error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/checkpoint/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const checkpoint = await checkpointStorage.getCheckpoint(id);
    
    if (!checkpoint) {
      return res.status(404).json({ error: "Checkpoint not found" });
    }
    
    res.json(checkpoint);
  } catch (error: any) {
    console.error("Get checkpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.delete("/checkpoint/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await checkpointStorage.deleteCheckpoint(id);
    res.status(204).send();
  } catch (error: any) {
    console.error("Delete checkpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
export const registerCheckpointRoutes = router;
