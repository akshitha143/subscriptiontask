const Subscription = require("../models/Subscription");
const Plan = require("../models/Plan");
// new changes
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubscription = async (req, res) => {
  const { userId, planId } = req.body;

  if (!userId || !planId) {
    return res.status(400).json({ message: "userId and planId are required" });
  }

  try {
    const existing = await Subscription.findOne({ userId });
    if (existing) {
      return res.status(409).json({ message: "User already has a subscription" });
    }

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const subscription = await Subscription.create({
      userId,
      plan,
      status: "ACTIVE",
      startDate: new Date(),
      endDate,
    });

    res.status(201).json({ message: "Subscription created", subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscription = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const sub = await Subscription.findOne({ userId }).populate("plan");
    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    const now = new Date();
    if (sub.endDate < now && sub.status === "ACTIVE") {
      sub.status = "EXPIRED";
      await sub.save();
    }

    res.json(sub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  const { userId } = req.params;
  const { planId } = req.body;

  if (!userId || !planId) {
    return res.status(400).json({ message: "userId and planId are required" });
  }

  try {
    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.duration);

    const sub = await Subscription.findOneAndUpdate(
      { userId },
      { plan, endDate, status: "ACTIVE" },
      { new: true }
    );

    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    res.json({ message: "Subscription updated", subscription: sub });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const sub = await Subscription.findOneAndUpdate(
      { userId },
      { status: "CANCELLED" },
      { new: true }
    );

    if (!sub) return res.status(404).json({ message: "Subscription not found" });

    res.json({ message: "Subscription cancelled", subscription: sub });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createPlan = async (req, res) => {
  const { name, price, features, duration } = req.body;

  if (!name || !price || !duration) {
    return res.status(400).json({ message: "name, price, and duration are required" });
  }

  try {
    const plan = new Plan({ name, price, features, duration });
    await plan.save();
    res.status(201).json({ message: "Plan created", plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  getPlans,
  createSubscription,
  getSubscription,
  updateSubscription,
  cancelSubscription,
  createPlan
};
