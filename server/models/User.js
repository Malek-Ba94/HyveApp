import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  naissance: { type: Date, required: true },
  tel: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favs: { type: Array, default: [] },
  trips: { type: Array, default: [] },
});

export default mongoose.model("User", UserSchema);