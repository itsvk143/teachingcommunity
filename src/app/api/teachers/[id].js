// pages/api/teachers/[id].js

import clientPromise from "@/lib/mongodb"; // Adjust the path if needed
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  if (method !== "GET") {
    return res.setHeader("Allow", ["GET"]).status(405).json({ message: `Method ${method} Not Allowed` });
  }

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid teacher ID" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(); // or db('yourDatabaseName') if you're using a named DB

    const teacher = await db.collection("teachers").findOne({ _id: new ObjectId(id) });

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
