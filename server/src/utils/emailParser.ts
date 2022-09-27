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