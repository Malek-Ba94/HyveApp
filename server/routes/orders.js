import express from "express";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { sendConfirmationEmail } from "../utils/sendConfirmationEmail.js";

const router = express.Router();

// commande création
router.post("/", async (req, res) => {
  try {
    const { userId, email, voyageId, montant, methode, titre, date } = req.body;

    const newOrder = new Order({
      userId,
      voyageId,
      montant,
      methode,
      titre,
      date,
      status: "Confirmé",
    });
    await newOrder.save();

    const tripData = {
      id: voyageId,
      title: titre,
      priceTnd: montant,
      date,
      methode,
      status: "Confirmé",
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { trips: tripData } },
      { new: true }
    ).select("-password");

    // envoiemail
    try {
      const recipient = email || updatedUser?.email;
      if (recipient) {
        await sendConfirmationEmail(recipient, {
          title: titre,
          finalTnd: montant,
          date,
        });
      }
    } catch (mailErr) {}

    res.status(201).json({
      message: "Commande créée, ajoutée à trips et email envoyé",
      order: newOrder,
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// récupérer toutes commandes
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// annnuler order
router.put("/cancel/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Annulé" },
      { new: true }
    );

    if (order) {
      await User.findOneAndUpdate(
        { _id: order.userId, "trips.id": order.voyageId },
        { $set: { "trips.$.status": "Annulé" } }
      );
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
