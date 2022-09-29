## 1 - Data Modeling

Written as typescript interfaces, the resulting data shapes would look something like this:

```

interface Message {
  id: string
  headers: string
  body: string
  sender: Person
  senderEmail: string
  recipients: Person[]
  attachments Attachment[]
}

model Attachment {
    id: string
    name?: string
    contents: Blob
    message: Message
}

interface Person {
    id: string
    email: string
    name?: string
    sentMessages: Message[]
    recievedMessages: Message[]
}

```

## Data Access

Written in the schema language of the Prisma ORM, the schema would look like this!

```
model Message {
  id          String   @id @default(cuid())
  headers     String
  body        String
  senderEmail String
  sender      Person   @relation("sentEmails", fields: [senderEmail], references: [email])
  recipients  Person[] @relation("recievedEmails")
  attachments Attachment[]
}

model Attachment {
  id        String   @id @default(cuid())
  name      String?
  contents  Bytes
  Message   Message? @relation(fields: [messageId], references: [id])
  messageId String?
}

model Person {
  id               Int       @id @default(autoincrement())
  email            String    @unique
  name             String?
  sentMessages     Message[] @relation("sentEmails")
  recievedMessages Message[] @relation("recievedEmails")
}
```

This translates into the SQL statements:

```
-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "headers" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "senderEmail" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "contents" BYTEA NOT NULL,
    "messageId" TEXT,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_recievedEmails" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_recievedEmails_AB_unique" ON "_recievedEmails"("A", "B");

-- CreateIndex
CREATE INDEX "_recievedEmails_B_index" ON "_recievedEmails"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderEmail_fkey" FOREIGN KEY ("senderEmail") REFERENCES "Person"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_recievedEmails" ADD CONSTRAINT "_recievedEmails_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_recievedEmails" ADD CONSTRAINT "_recievedEmails_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```

## 3 - Parsing

Written in typescript, the parsing function would look like:

```
export function getSender(
  header: string
): null | { name?: string; email: string } {
  //TODO: Variations on "From" are possible.
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
```

## 4 - Unit Testing

My unit tests for my parser function look like this:

```
import { getSender } from "./emailParser";

describe("run some parser tests ", () => {
  it("should parse out the name", () => {
    const providedHeader = `
From: John Doe <jdoe@machine.example>
To: Mary Smith <mary@example.net>
Subject: Saying Hello
Date: Fri, 21 Nov 1997 09:55:06 -0600
Message-ID: <1234@local.machine.example>

This is a message just to say hello.
So, "Hello".
`;

    const { name, email } = getSender(providedHeader)!;
    expect(name).toBe("John Doe");
    expect(email).toBe("jdoe@machine.example");
  });

  it("should parse out my other understanding of the email spec", () => {
    const providedHeader = `
From: jdoe@machine.example
To: Mary Smith <mary@example.net>
Subject: Saying Hello
Date: Fri, 21 Nov 1997 09:55:06 -0600
Message-ID: <1234@local.machine.example>

This is a message just to say hello.
So, "Hello".
`;

    const { email } = getSender(providedHeader)!;
    expect(email).toBe("jdoe@machine.example");
  });
});
```


## 5 - Containerization 


```
docker-compose up -d
cd server
npm install
npx prisma migrate dev --name init
npm run test
```

## 6 -Technical Writing

Please create a UI for the displaying of emails. 
- The Application should be only accessible for authenticated users, with communications over https. 
- Users should be able to query the system and recieve back paginated results, filterable by criteria including (but not limited to):
  - sender email(s)
  - sender name(s)
  - date range
  - recipient email(s)
- The results should be displayed in a list view, 
- Entries in the list view should launching a modal with complete results for the entry
- Results should be exportable to csv. 


## 7 - System Diagram

The system would feature:
- A persistence layer in the form of SQL database
- A webapp and API. Next.js integrates the API and client code into the same build, effectively squashing those layers into one
- reverse proxy / load balancer (Nginx) to stand in front of the app server
- Authentication via browser sessions (tracked in a table in the database, or using an identity-as-a-service like Auth0