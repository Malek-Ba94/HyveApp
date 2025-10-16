import express from "express";
import User from "../models/User.js";
import { sendConfirmationEmail } from "../utils/sendConfirmationEmail.js";

const router = express.Router();

// créer user
router.post("/register", async (req, res) => {
  try {
    const { nom, prenom, email, password, naissance, tel, pref } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Un compte avec cet email existe déjà" });
    }

    const newUser = new User({
      nom,
      prenom,
      email,
      password,
      naissance,
      tel,
      pref,
      favs: [],
      trips: [],
    });

    await newUser.save();

    const userData = newUser.toObject();
    delete userData.password;

    res.status(201).json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// connexion
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Champs manquants (email ou mot de passe)" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res
        .status(401)
        .json({ error: "Email ou mot de passe incorrect" });
    }

    const userData = user.toObject();
    delete userData.password;

    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ajout voyage payé
router.post("/add-trip", async (req, res) => {
  try {
    const { userId, trip } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { trips: trip } },
      { new: true }
    ).select("-password");

    try {
      const user = await User.findById(userId).select("email");
      if (user && user.email) {
        await sendConfirmationEmail(user.email, trip);
      }
    } catch (mailErr) {}

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// supp trip
router.post("/remove-trip", async (req, res) => {
  try {
    const { userId, tripId } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { trips: { id: tripId } } },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ajout retirer favori
router.post("/toggle-fav", async (req, res) => {
  try {
    const { userId, fav } = req.body;
    if (!userId || !fav || !fav.id) {
      return res.status(400).json({ error: "userId ou fav manquant" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

    const favId = fav.id.toString().trim().toLowerCase();
    const exists = user.favs.some(
      (f) => (f.id || "").toString().trim().toLowerCase() === favId
    );

    if (exists) {
      await User.updateOne({ _id: userId }, { $pull: { favs: { id: fav.id } } });
    } else {
      await User.updateOne({ _id: userId }, { $push: { favs: fav } });
    }

    const updatedUser = await User.findById(userId).select("-password");
    res.json({ favs: updatedUser.favs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// récupé info utilisateur
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
