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
} from "@chakra-ui/react";
import { useState } from "react";

export function ImportEmailsModal({
  onClose,
}: {
  onClose: () => void;
}): JSX.Element {
  const [stuff, setStuff] = useState<string>("");

  return (
    <Modal isOpen={true} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={3}>
            <InputGroup onSubmit={(e) =>console.log(e) }>
              <Input
                placeholder="medium size"
                size="md"
                onChange={(e) => setStuff(e.target.value)}
              />
 
              <Input placeholder="medium size" size="md"/>
              <Input placeholder="medium size" size="md" />

              <Button type='submit'>Submit</Button>
            </InputGroup>
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
