import { createRouter } from "./context";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { PrismaClientOptions } from "@prisma/client/runtime";

export const exampleRouter = createRouter()
  .query("submit", {
    input: z
      .object({
        text: z.string(),
      })
      .nullish(),
    async resolve({ input }) {
      return prisma?.message.create({ data: {} });
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.example.findMany();
    },
  });

function parseHeader(
  header: string
):
  | (Prisma.Without<
      Prisma.MessageCreateInput,
      Prisma.MessageUncheckedCreateInput
    > &
      Prisma.MessageUncheckedCreateInput)
  | (Prisma.Without<
      Prisma.MessageUncheckedCreateInput,
      Prisma.MessageCreateInput
    > &
      Prisma.MessageCreateInput) {
  const body = "";

  const attachments: any = [];

  const recipients: any = [];

  return { body, attachments, recipients, senderEmail };
}
