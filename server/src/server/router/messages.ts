import { createRouter } from "./context";
import { z } from "zod";
import console from "console";
import { parseAndPersistMessage } from "../../utils/parseAndPersistMessage";

export const messagesRouter = createRouter()
  .query("getById", {
    input: z
      .object({
        id: z.string(),
      })
      .nullish(),
    async resolve({ input }) {
      if (!input?.id == null) return;

      return prisma?.message.findUnique({
        where: { id: "fjdf" },
        select: {
          from: true,
          to: true,
          text: true,
          subject: true,
        },
      });
    },
  })
  .query("getBySender", {
    input: z
      .object({
        senderEmail: z.string(),
      })
      .nullish(),
    async resolve({ input }) {
      return prisma?.message.findMany({
        where: { senderEmail: input?.senderEmail },
      });
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return ctx.prisma.message.findMany({
        include: { from: true, to: true, },
      });
    },
  })
  .mutation("addMessage", {
    input: z.object({
      message: z.string(),
    }),
    resolve: async ({ input }) => {
      console.log("wasssup")
      console.log(input.message);
      return await parseAndPersistMessage(input.message)
    },
  });
