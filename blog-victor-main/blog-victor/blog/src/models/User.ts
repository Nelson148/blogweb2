// models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role?: string;
  image?: string; // <--- Novo campo para a foto (Base64)
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    image: { type: String }, // <--- Definido como String para aceitar o Base64
  },
  { timestamps: true } // Cria createdAt e updatedAt automaticamente
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);