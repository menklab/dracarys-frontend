import type { NextApiRequest, NextApiResponse } from "next";

interface BackendAttributesInterface {
  name: string;
  type: string;
  fieldThatWillNotBeUsedInFrontendApp?: string;
}

interface BackendAccountInterface {
  id: number;
  name: string;
  attributes: BackendAttributesInterface[];
  pos?: { x: number; y: number };
  accounts: number[];
}

const accounts: BackendAccountInterface[] = [
  {
    id: 0,
    name: "User",
    attributes: [
      { name: "id", type: "ID" },
      { name: "name", type: "String" },
      { name: "pet", type: "Pet" },
      { name: "food", type: "Food" },
    ],
    pos: { x: 300, y: 600 },
    accounts: [1],
  },
  {
    id: 1,
    name: "Pet",
    attributes: [
      { name: "id", type: "ID" },
      { name: "name", type: "String" },
    ],
    // pos: {x: 100, y: 100},
    accounts: [2, 0],
  },
  {
    id: 2,
    name: "Food",
    attributes: [
      { name: "id", type: "ID" },
      { name: "name", type: "String" },
    ],
    pos: { x: 600, y: 200 },
    accounts: [0],
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return res.status(200).json({ accounts });
    case "POST":
      accounts.push(req.body);
      return res.status(200).end();
    case "PUT":
      const { id, pos } = req.body;
      const idx = accounts.findIndex((account) => account.id === id);
      if (idx !== -1) accounts[idx].pos = pos;
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return res.status(200).end();
  }

  res.status(500).end();
}