import mongoose, { Schema, Document } from "mongoose";
import "./User";
import "./Comment";

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  comments?: mongoose.Types.ObjectId[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String }, 
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);