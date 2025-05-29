const express = require("express");
const router = express.Router();


const {
  getPlans,
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  createPlan
} = require("../controllers/subscriptionController");

router.get("/plans",  getPlans);
router.post("/", createSubscription);
router.get("/:userId",  getSubscription);
router.put("/:userId",  updateSubscription);
router.delete("/:userId",  cancelSubscription);
router.post("/createplan", createPlan);

module.exports = router;
