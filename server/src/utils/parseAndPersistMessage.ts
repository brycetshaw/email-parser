import { Person } from "@prisma/client";
import console from "console";
import { EmailAddress, ParsedMail } from "mailparser";

export async function parseAndPersistMessage(
  message: ParsedMail
): Promise<boolean> {
  try {
    console.log("sdklfjklsdfjklasdjklfasdjkl");
    // parse the message
    const { from, text, subject, date, to } = message;

    // const parsed = await simpleParser(message);
    console.log("from:", from);
    // This only supports single recipients at the moment.
    const recipient = ((Array.isArray(to) && to[0]?.value) ||
      (!Array.isArray(to) && to?.value)) as EmailAddress | undefined;

    // persist the email addresses
    const [fromPerson, toPerson] = await Promise.all([
      createOrFindPerson(from?.value[0]),
      createOrFindPerson(recipient),
    ]);

    console.log("asdfklasdjkljklasd");
    console.log(fromPerson, toPerson);
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
    console.log("whioopwe");
    return false;
  }

  return true;
}

async function createOrFindPerson(
  emailAddress: EmailAddress | undefined
): Promise<Person | undefined> {
  console.log(emailAddress);
  if (!emailAddress || !emailAddress.address) {
    console.log("buuttsd");

    throw new Error("Email required!");
  }

  const { name, address } = emailAddress;

  console.log(name, address);

  return (
    (await prisma?.person.findUnique({ where: { email: address } })) ??
    (await prisma?.person.create({ data: { email: address, name } }))
  );
}
