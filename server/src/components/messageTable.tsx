import { Message } from "@prisma/client";
import { Table, TableContainer, Tbody, Td, Th, Tr } from "@chakra-ui/react";

import styles from "./messageTable.module.css";
export const MessageTable = ({
  data,
  setMessage,
  activeMessage,
}: {
  data: Message[];
  activeMessage: Message | undefined;
  setMessage: (message: Message) => void;
}) => {
  const headers = ["Sender", "Subject"];

  return (
    <TableContainer>
      <Table>
        <Tbody>
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
        </Tbody>
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
