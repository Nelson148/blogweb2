import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const posts = await Post.find().populate("author").populate("comments");
  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  await dbConnect();
  const user = await User.findById((session.user as any).id);

  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Apenas administradores podem criar posts" }, { status: 403 });
  }

  const { title, content } = await req.json();
  const post = await Post.create({ title, content, author: user._id });

  return NextResponse.json(post, { status: 201 });
}
