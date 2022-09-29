import {
  Button,
  Input,
  InputGroup,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  InputLeftElement,
  InputLeftAddon,
  NumberInputProps,
} from "@chakra-ui/react";
import { useState } from "react";
import { trpc } from "../utils/trpc";

interface Inputs {
  email: string | undefined | null;
}

export function ImportEmailsModal({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const { mutate } = trpc.useMutation(["messages.addMessage"], {
    onSuccess: async () => {
      await trpc.useContext().invalidateQueries(["messages.getFiltered"]);
    },
  });
  const [stuff, setStuff] = useState<Inputs>({ email: "" });

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log();
              }}
            >
              <InputGroup>
                <InputLeftAddon>Email</InputLeftAddon>

                <Input
                  placeholder="medium size"
                  title="lol"
                  size="md"
                  value={stuff.email as string}
                  onChange={(e) =>
                    setStuff({ ...stuff, email: e.target.textContent })
                  }
                />
              </InputGroup>

              <Input placeholder="medium size" size="md" />
              <Input placeholder="medium size" size="md" />

              <Button
                onClick={() => mutate({ password: null, username: null })}
              >
                Submit
              </Button>
            </form>
          </Stack>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
