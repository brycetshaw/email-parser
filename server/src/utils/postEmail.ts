import { Prisma } from "@prisma/client";
import { simpleParser } from "mailparser";

export type MessageCreate =
  | (Prisma.Without<
      Prisma.MessageCreateInput,
      Prisma.MessageUncheckedCreateInput
    > &
      Prisma.MessageUncheckedCreateInput)
  | (Prisma.Without<
      Prisma.MessageUncheckedCreateInput,
      Prisma.MessageCreateInput
    > &
      Prisma.MessageCreateInput);

export async function postEmail(message: string) {
  const { from, subject, text, html } = await simpleParser(message);
  const lol = await simpleParser(message);

  console.log(JSON.stringify(lol, undefined, 4));

  const { name: senderName, address: senderAddress } = from?.value[0] ?? {};

  // TODO

  if (!senderAddress) return;

  const data: MessageCreate = {
    senderEmail: from?.value[0]?.address ?? "",
    subject: subject,
    text: text ?? "",
    html: html || "",
    to: 
  };

  const person = await prisma?.person.findUnique({
    where: { email: senderAddress },
  });

  if (!person) {
    await prisma?.person.create({
      data: { email: senderAddress, name: senderName },
    });
  }

  return prisma?.message.create({ data });
}
