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
  const id = req.query.programId as unknown as number;

  switch (req.method) {
    case "GET":
      return res.status(200).json({ program: programs[id] });
    case "PATCH":
      programs[id].name = req.body.name;
      return res.status(200).end();
    case "DELETE":
      programs.splice(id, 1);
      return res.status(200).end();
  }

  res.status(500).end();
}
