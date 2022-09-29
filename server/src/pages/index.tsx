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
  const {
    setPage,
    page,
    sender,
    setSender,
    peopleOptions,
    data,
    setActiveMessage,
    activeMessage,
  } = useFilteredData();

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
            <div>
              Email <span className={styles.titlePink}>Search</span> Service
            </div>
            <Button
              className={styles.importButton}
              onClick={() => setOpenImports(true)}
            >
              Import!
            </Button>
          </h1>

          <div className={styles.row}>
            <div className={styles.column}>
              <Stack>
                <StackItem>
                  <Menu>
                    <MenuButton as={Button}>
                      Sender{sender ? `: ${sender}` : ""}
                    </MenuButton>
                    <MenuList>
                      {[{ email: "None" }, ...(peopleOptions ?? [])]?.map(
                        ({ email }) => (
                          <MenuItem
                            onClick={(e) =>
                              setSender(email === "None" ? undefined : email)
                            }
                            key={`sender-option-${email}`}
                          >
                            {email}
                          </MenuItem>
                        )
                      )}
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
            </div>

            {data ? (
              <MessageTable
                data={data as Message[]}
                setMessage={setActiveMessage}
                activeMessage={activeMessage}
              />
            ) : (
              <div>Loading...</div>
            )}
          </div>
          <div>
            <div className={styles.row}>{activeMessage?.text}</div>
          </div>
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

  const [activeMessage, setActiveMessage] = useState<undefined | Message>();
  useEffect(() => {
    setPage(0);
  }, [sender]);

  useEffect(() => {
    setActiveMessage(undefined);
  }, [page, sender]);
  const { data: peopleOptions } = trpc.useQuery(["messages.getPeople"]);

  const { data } = trpc.useQuery(["messages.getFiltered", { page, sender }]);

  return {
    peopleOptions,
    page,
    setPage,
    sender,
    setSender,
    data,
    setActiveMessage,
    activeMessage,
  };
}
