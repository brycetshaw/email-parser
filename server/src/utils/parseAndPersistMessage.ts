import { Person } from "@prisma/client";
import { EmailAddress, simpleParser } from "mailparser";

export async function parseAndPersistMessage(message: string): Promise<boolean> {
  try {
    // parse the message
    const { from, text, subject, date, to } = await simpleParser(message);

    // This only supports single recipients at the moment.
    const recipient = ((Array.isArray(to) && to[0]?.value) ||
      (!Array.isArray(to) && to?.value)) as EmailAddress | undefined;

    // persist the email addresses
    const [fromPerson, toPerson] = await Promise.all([
      createOrFindPerson(from?.value[0]),
      createOrFindPerson(recipient),
    ]);

    // persist the message
    prisma?.message.create({
      data: {
        from: { connect: { email: fromPerson?.email } },
        text: text ?? "",
        to: { connect: { email: toPerson?.email } },
        date,
        subject,
      },
    });
  } catch {
    return false;
  }

  return true;
}

async function createOrFindPerson(
  emailAddress: EmailAddress | undefined
): Promise<Person | undefined> {
  if (!emailAddress || !emailAddress.address)
    throw new Error("Email required!");

  const { name, address } = emailAddress;

  return (
    (await prisma?.person.findUnique({ where: { email: address } })) ??
    (await prisma?.person.create({ data: { email: address, name } }))
  );
}
