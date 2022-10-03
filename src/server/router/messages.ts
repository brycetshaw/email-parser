import { createRouter } from "./context";
import { z } from "zod";
import { getSomeEmails } from "../../utils/getEmails";
import {prisma} from "../db/client";

export const messagesRouter = createRouter()
  .query("getFiltered", {
    input: z
      .object({
        id: z.string().nullish(),
        sender: z.string().nullish(),
        recipient: z.string().nullish(),
        page: z.number().nullish(),
      })
      .nullish(),
    async resolve({ input }) {

      const { id, sender, page } = input ?? {};

      const take = 10;
      const skip = (page ?? 0) * take;

      // return single result if the id is provided
      if (id != null) {
        return [
         await prisma.message.findUnique({
            where: { id },
            include: { from: true, to: true },
          }),
        ];
      }

      return await prisma.message.findMany({
        where: {
          ...(sender && { senderEmail: { equals: sender } }),
          // ...(recipient && { recipient: { equals: recipient } }),
        },
        include: { from: true, to: true },
        orderBy: { date: "asc" },
        skip,
        take,
      });
    },
  })
  .mutation("seedDataBase", {
    input: z.object({
      username: z.string(),
      password: z.string(),
      howMany: z.number(),
    }),
    resolve: async ({ input: { username, password, howMany } }) => {
      return await getSomeEmails(username, password, howMany);
    },
  })

  .query("getSenders", {
    input: z.object({}).nullish(),
    async resolve({ input }) {
      if (!prisma) return false
      const peopleOptions = await prisma.person.findMany({
        include: { _count: { select: { sentMessages: true } } },
      });

      return await peopleOptions?.filter(({ _count }) => _count.sentMessages);
    },
  });
