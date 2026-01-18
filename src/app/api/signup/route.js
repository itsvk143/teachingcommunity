import User from "../../../model/User";
import dbConnect from "../../../lib/dbConnect";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { name, email, password } = await request.json();

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ message: "User already exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  return new Response(JSON.stringify({ message: "User created" }), {
    status: 201,
  });
}
