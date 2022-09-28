import { Person, Prisma } from "@prisma/client";
import { EmailAddress, simpleParser } from "mailparser";
import { MessageCreate } from "./postEmail";


export function getSender(
  header: string
): null | { name?: string; email: string } {
  const fromRow = header.match(/From:(.*)>/);

  if (!fromRow || fromRow.length === 0) return getEmailOnly(header);

  const [name, email] = fromRow[0]
    ?.split("<")
    .map((entry) => entry.trim())
    .map((str) => str.replace("From: ", "").replace(">", "")) as [
    string,
    string
  ];

  return { name, email };
}

function getEmailOnly(header: string): null | { name?: string; email: string } {
  // A very hasty reading of the email RFC spec suggests that
  // From: admin@example.com
  // is also a valid email originator. I will proceed as if it is...
  const fromRow = header.match(/From:(.*)/);
  if (!fromRow || fromRow.length === 0) return null;

  const [email] = fromRow[0]
    ?.split("<")
    .map((entry) => entry.trim())
    .map((str) => str.replace("From: ", "").replace(">", "")) as [string];
  return { email };
}

async function parseEmail(message: string): Prisma.MessageCreateInput {

  const {from, text, subject,  date, to} = await simpleParser(message)

  const [fromPerson, toPerson] = await Promise.all([createOrFindPerson(from?.value[0]), createOrFindPerson(from?.value[0])])

  return {
    from: {connect: {email: fromPerson?.email}}, 
    text: text ?? '',
    to: {connect: {email: toPerson?.email}}
  }

}

async function createOrFindPerson(emailAddress: EmailAddress | undefined): Promise<Person | undefined> {

  if(!emailAddress|| !emailAddress.address) throw new Error("Email required!")

  const {name, address} = emailAddress

  return await prisma?.person.findUnique({where: {email: address}}) ?? await prisma?.person.create({data: {email: address , name}})
}