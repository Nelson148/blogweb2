import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  await dbConnect();
  const users = await User.find();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await dbConnect();
  const { name, email, password, role } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
  });

  const out = user.toObject();
  delete (out as any).password;

  return NextResponse.json(out, { status: 201 });
}
