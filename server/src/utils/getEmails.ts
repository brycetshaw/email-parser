import { simpleParser } from "mailparser";
import Imap from "node-imap";
import { inspect } from "util";
import console from "console";
import { EmailAddress, ParsedMail } from "mailparser";
export async function getSomeEmails(user: string, password: string) {
  const imap = new Imap({
    user,
    password,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
  });

  function openInbox(cb: {
    (err: Error, box: Imap.Box): void;
    (error: Error, mailbox: Imap.Box): void;
  }) {
    imap.openBox("INBOX", true, cb);
  }

  imap.once("ready", function () {
    openInbox(function (err: Error, box: Imap.Box) {
      if (err) throw err;
      console.log(box.messages.total + " message(s) found!");
      // 1:* - Retrieve all messages
      // 3:5 - Retrieve messages #3,4,5
      const f = imap.seq.fetch("1:100", {
        bodies: "",
      });
      f.on("message", function (msg, seqno) {
        const prefix = "(#" + seqno + ") ";

        msg.on("body", function (stream, info) {
          // use a specialized mail parsing library (https://github.com/andris9/mailparser)
          simpleParser(stream, (err, mail) => {
            parseAndPersistMessage(mail);
          });

          // or, write to file
          //stream.pipe(fs.createWriteStream('msg-' + seqno + '-body.txt'));
        });
        msg.once("attributes", function (attrs) {
          console.log(prefix + "Attributes: %s", inspect(attrs, false, 8));
        });
        msg.once("end", function () {
          console.log(prefix + "Finished");
        });
      });
      f.once("error", function (err) {
        console.log("Fetch error: " + err);
      });
      f.once("end", function () {
        console.log("Done fetching all messages!");
      });
    });
  });

  imap.once("error", function (err) {
    console.log(err);
  });

  imap.once("end", function () {
    console.log("Connection ended");
  });

  imap.connect();
}

async function parseAndPersistMessage(message: ParsedMail): Promise<boolean> {
  try {
    // parse the message
    const { from, text, subject, date, to } = message;

    // This only supports single recipients at the moment.
    const recipient = ((Array.isArray(to) && to[0]?.value) ||
      (!Array.isArray(to) && to?.value)) as EmailAddress | undefined;

    type UsersDTO = { name: string; address: string | undefined };

    const persistUsers = async (input: UsersDTO[]) => {
      return Promise.all(
        input
          .filter(({ address }) => Boolean(address))
          .map(async ({ name, address }) => {
            const alreadyExistingPerson = await prisma?.person.findUnique({
              where: { email: address },
            });

            if (alreadyExistingPerson) return alreadyExistingPerson;

            const person = await prisma?.person.create({
              data: { email: address as string, name },
            });
            return person;
          })
      );
    };

    // apologies to whatever deity is in charge of code readability...

    const toUsersDto: UsersDTO[] = Array.isArray(to)
      ? to
          .map(({ value }) =>
            value.map(({ name, address }) => ({ name, address }))
          )
          .flat()
      : to?.value.map(({ name, address }) => ({ name, address })) ?? [];

    const toUsers = await persistUsers(toUsersDto);

    const fromUsersDto =
      from?.value.map(({ address, name }) => ({ name, address })) ?? [];
    const fromUsers = await persistUsers(fromUsersDto);

    if (!fromUsers?.length || !toUsers?.length) return false;

    // persist the message
    await prisma?.message.create({
      data: {
        from: {
          connect: { email: fromUsersDto[0]!.address as string },
        },
        text: text ?? "",
        to: {
          connect: toUsersDto.map(({ name, address }) => ({ email: address })),
        },
        date,
        subject,
      },
    });
  } catch {
    return false;
  }

  return true;
}
