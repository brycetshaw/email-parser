import { createRouter } from "./context";
import { z } from "zod";
import { getSomeEmails } from "../../utils/getEmails";

export const messagesRouter = createRouter()
  .query("getFiltered", {
    input: z
      .object({
        id: z.string().nullable(),
        sender: z.string().nullable(),
        recipient: z.string().nullable(),
        page: z.number(),
      })
      .nullish(),
    async resolve({ input }) {
      if (!prisma) throw new Error("invalid DB context");

      const { id, recipient, sender, page } = input ?? {};
      const take = 10;
      const skip = (page ?? 0) * take;
      if (id != null) {
        return prisma.message.findUnique({
          where: { id },
          include: { from: true, to: true },
        });
      }

      return prisma.message.findMany({
        where: {
          ...(sender && { senderEmail: { equals: sender } }),
          ...(recipient && { recipient: { equals: recipient } }),
        },
        include: { from: true, to: true },
        orderBy: { date: "asc" },
        skip,
        take,
      });
    },
  })
  .mutation("addMessage", {
    input: z.object({
      username: z.string().nullable(),
      password: z.string().nullable(),
    }),
    resolve: async ({ input: { username, password } }) => {
      await getSomeEmails("shaw.bryce@gmail.com", "mvlrptczkeknaank");
    },
  });
