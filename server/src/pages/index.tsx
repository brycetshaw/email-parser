import { Attachment, Message, Person } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import styles from "./index.module.css";
import messages from "./messages/[messageId]";
import { useRouter } from "next/router";

type IMessage =(Message & {
  from: Person;
  to: Person[];
  attachments: Attachment[];
})[] 

const Home: NextPage = () => {
  const { mutate } = trpc.useMutation(["messages.addMessage"]);

  const { data } = trpc.useQuery(["messages.getAll"]);
  const [message, setMessage] = useState<null | string>(null);
  return (
    <>
      <Head>
        <title>Email Search Service</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <h1 className={styles.title}>
            Email <span className={styles.titlePink}>Search</span> Service
          </h1>
          {
            data ?

          <MessageTable  data={data} />
          : <div>Loading</div>
          }
        </div>
        <textarea style={{whiteSpace: 'pre'}} onChange={(e) => setMessage(e.target.value)}></textarea>
          <button
            disabled={!message}
            onClick={() => {
              console.log(message);
              if (message) {
                mutate({ message });
              }
            }}
          >
            Submit
          </button>
      </div>
    </>
  );
};

export default Home;


const MessageTable = ({data}: {data: IMessage}) => {


  const headers = ["Sender", "Subject"];

  return (
    <table>
      <tr>
        {headers.map((subject) => (
          <th key={subject}>{subject}</th>
        ))}
      </tr>
   {     data?.map((message) => (
          <MessageTableRow
            message={message}
            key={`message=${message.id}`}
          />
        )
      )}
    </table>
  );
};

const MessageTableRow = ({
  message: { senderEmail, subject, id },
}: {
  message: Message;
}) => {

 const router = useRouter()
  return (
    <tr
      onClick={() => {
        router.push(`messages/${id}`)
      }}
    >
      <td>{senderEmail}</td>
      <td>{subject}</td>
    </tr>
  );
};
