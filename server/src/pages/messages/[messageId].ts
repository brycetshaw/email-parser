// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/db/client";

const messages = async (req: NextApiRequest, res: NextApiResponse) => {
  const examples = await prisma.message.findMany();

  const { messageId } = req.query;

  // if (id) {
  //   const messages = prisma.message.findUniqueOrThrow({ where: { id: id } });
  // }

  res.status(200).json(examples);
};

export default messages;
