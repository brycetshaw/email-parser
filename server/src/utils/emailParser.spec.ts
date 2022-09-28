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
