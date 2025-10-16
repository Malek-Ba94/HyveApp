import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, 
  description: { type: String },
  priceTnd: { type: Number, required: true },
  discountPct: { type: Number, default: 0 },
  photo: { type: String },
  dates: [{ type: String }], 
});

export default mongoose.model("Service", serviceSchema);
