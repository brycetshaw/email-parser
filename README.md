# Email Viewer

This is an app that is able to fetch some emails (if you give it a valid gmail account login and app password). 
I would not recommend fetching your personal email in the deployed version, unless you're comfortable sharing some
messages with the internet.

## The cool parts 

- This project uses Next.js and tRPC to create a tightly coupled, type-safe connection between the front and backend. 
- Uses prisma as an object relational mapper.
- Deployed with vercel, with a persistence layer in the form of a postgres database in Heroku.
- Uses `mailparser` and `node-imap` to fetch emails from gmail and parse them to a format that can be persisted. 