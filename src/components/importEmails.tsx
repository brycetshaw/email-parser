import {
  Button,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  InputLeftAddon,
} from "@chakra-ui/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

export function ImportEmailsModal({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const { mutate } = trpc.useMutation(["messages.seedDataBase"], {
    onSuccess: async () => {
      await trpc.useContext().invalidateQueries(["messages.getFiltered"]);
    },
  });
  const [email, setEmail] = useState<string | undefined>(
    "shaw.bryce@gmail.com"
  );
  const [password, setPassword] = useState<string | undefined>(
    "mvlrptczkeknaank"
  );

  const [howMany, setHowMany] = useState(100);

  const handleSubmit = () => {
    mutate({
      password: password as string,
      username: email as string,
      howMany,
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Seed Db</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <InputGroup>
              <InputLeftAddon>Email</InputLeftAddon>
              <Input
                size="md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon>App Password</InputLeftAddon>
              <Input
                size="md"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon>How Many?</InputLeftAddon>
              <Input
                size="md"
                value={howMany}
                onChange={(e) => setHowMany(Number(e.target.value))}
              />
            </InputGroup>
            <Button
              disabled={!password || !email || !howMany}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
