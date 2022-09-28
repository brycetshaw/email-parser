import { Message, Person } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { trpc } from "../utils/trpc";
import styles from "./index.module.css";
import {
  Button,
  Grid,
  GridItem,
  Table,
  TableContainer,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import { ImportEmailsModal } from "../components/importEmails";

type IMessage = Message & {
  from: Person;
  to: Person[];
};

const Home: NextPage = () => {
  const { data } = trpc.useQuery(["messages.getAll"]);
  const [message, setMessage] = useState<undefined | IMessage>();

  const [openImports, setOpenImports] = useState(false);

  return (
    <>
      <Head>
        <title>Email Search Service</title>
        <meta name="description" content="Search through some emails!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.containerOuter}>
        <div className={styles.containerInner}>
          <h1 className={styles.title}>
            Email <span className={styles.titlePink}>Search</span> Service
            <Button onClick={() => setOpenImports(true)}>Import!</Button>
          </h1>

          <Grid
            className={styles.containerGrid}
            gap={1}
            templateRows="repeat(5, 1fr)"
            templateColumns="repeat(3, 1fr)"
          >
            <GridItem colSpan={1} rowSpan={2} bg={"lightseagreen"}>
              Filters
            </GridItem>
            <GridItem colSpan={2} rowSpan={5} bg={"lightgrey"}>
              {message?.text}
            </GridItem>
            <GridItem rowSpan={4} colSpan={1}>
              {data ? (
                <MessageTable
                  data={data}
                  setMessage={setMessage}
                  activeMessage={message}
                />
              ) : (
                <div>Loading...</div>
              )}
            </GridItem>
          </Grid>
        </div>
        {openImports && (
          <ImportEmailsModal onClose={() => setOpenImports(false)} />
        )}
      </div>
    </>
  );
};

export default Home;

const MessageTable = ({
  data,
  setMessage,
  activeMessage,
}: {
  data: IMessage[];
  activeMessage: IMessage | undefined;
  setMessage: (message: IMessage) => void;
}) => {
  const headers = ["Sender", "Subject"];

  return (
    <TableContainer>
      <Table>
        <Tr>
          {headers.map((subject) => (
            <Th key={subject}>{subject}</Th>
          ))}
        </Tr>
        {data?.map((message) => (
          <MessageTableRow
            message={message}
            onClick={() => setMessage(message)}
            active={activeMessage?.id === message.id}
            key={`message=${message.id}`}
          />
        ))}
      </Table>
    </TableContainer>
  );
};

const MessageTableRow = ({
  message: { senderEmail, subject },
  active,
  onClick,
}: {
  message: Message;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <Tr className={active ? styles.activeRow : ""} onClick={onClick}>
      <Td>{senderEmail}</Td>
      <Td>{subject}</Td>
    </Tr>
  );
};
