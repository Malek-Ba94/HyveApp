import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  voyageId: String,
  montant: Number,
  methode: String,
  titre: String,
  date: String,
  status: { type: String, default: "Confirmé" },
});

export default mongoose.model("Order", OrderSchema);
