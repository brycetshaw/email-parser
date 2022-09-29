import { Message } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import styles from "./index.module.css";
import {
  Button,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  StackItem,
} from "@chakra-ui/react";
import { ImportEmailsModal } from "../components/importEmails";
import { MessageTable } from "../components/messageTable";

const Home: NextPage = () => {
  const { setPage, page, sender, setSender, peopleOptions, data } =
    useFilteredData();

  const [message, setMessage] = useState<undefined | Message>();

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
            <GridItem>
              <Stack>
                <StackItem>
                  <Menu>
                    <MenuButton as={Button}>
                      Sender{sender ? `: ${sender}` : ""}
                    </MenuButton>
                    <MenuList>
                      {peopleOptions?.map(({ email }) => (
                        <MenuItem
                          onClick={(e) => setSender(email)}
                          key={`sender-option-${email}`}
                        >
                          {email}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                </StackItem>
                <StackItem>
                  <Button
                    disabled={page <= 0}
                    onClick={() => setPage(page - 1)}
                  >
                    {"<"}
                  </Button>{" "}
                  {page}{" "}
                  <Button onClick={() => setPage(page + 1)}>{">"}</Button>
                </StackItem>
              </Stack>
            </GridItem>
            <GridItem colSpan={2} rowSpan={5} bg={"lightgrey"}>
              {message?.text}
            </GridItem>
            <GridItem rowSpan={4} colSpan={1}>
              {data ? (
                <MessageTable
                  data={data as Message[]}
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

function useFilteredData() {
  const [page, setPage] = useState<number>(0);
  const [sender, setSender] = useState<string | undefined>();

  useEffect(() => {
    setPage(0);
  }, [sender]);
  const { data: peopleOptions } = trpc.useQuery(["messages.getPeople"]);

  const { data } = trpc.useQuery(["messages.getFiltered", { page, sender }]);

  return {
    peopleOptions,
    page,
    setPage,
    sender,
    setSender,
    data,
  };
}
