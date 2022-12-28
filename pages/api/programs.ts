import type { NextApiRequest, NextApiResponse } from "next";

interface BackendAccountInterface {
  id: number;
  name: string;
}

const programs: BackendAccountInterface[] = [
  {
    id: 0,
    name: "Shop",
  },
  {
    id: 1,
    name: "Bank",
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ programs });
    case "POST":
      programs.push({ id: programs.length, name: req.body.name });
      return res.status(200).end();
  }

  res.status(500).end();
}
