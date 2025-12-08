// app/api/comments/route.ts
import dbConnect from "@/lib/db";
import Comment from "@/models/Comment";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const comments = await Comment.find()
    .populate("author") 
    .populate("post");  
  return NextResponse.json(comments);
}

export async function POST(req: Request) {
  await dbConnect();
  const { content, authorId, postId } = await req.json();

  const comment = await Comment.create({
    content,
    author: authorId,
    post: postId,
  });

  return NextResponse.json(comment, { status: 201 });
}
