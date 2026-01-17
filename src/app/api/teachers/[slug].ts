import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Teacher from '@/model/Teacher';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const teacher = await Teacher.findOne({ slug: req.query.slug });
    if (!teacher) return res.status(404).json({ error: 'Not Found' });
    res.status(200).json(teacher);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
