import { useState } from "react";
import styled from "styled-components";
import { redeemPreviewCode } from "../requests";
import { Trigger } from "../theme/sharedStyled";

export function PreviewAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
    setCode("");
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setIsRedeeming(true);

      await redeemPreviewCode(code.trim());

      handleClose();

      // TODO:
      // refresh/reload user state here
    } catch (error) {
      console.error(error);

      setError("That code did not work.");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <>
      <Trigger type="button" onClick={() => setIsOpen(true)}>
        Preview Access
      </Trigger>

      {isOpen && (
        <Overlay>
          <Modal>
            <Title>Preview Access</Title>

            <Description>
              Enter your preview code to unlock the books.
            </Description>

            <CodeInput
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter code"
              autoFocus
            />

            {!!error && <ErrorText>{error}</ErrorText>}

            <Actions>
              <SecondaryButton type="button" onClick={handleClose}>
                Cancel
              </SecondaryButton>

              <PrimaryButton
                type="button"
                onClick={handleSubmit}
                disabled={!code.trim() || isRedeeming}
              >
                {isRedeeming ? "Unlocking..." : "Unlock Books"}
              </PrimaryButton>
            </Actions>
          </Modal>
        </Overlay>
      )}
    </>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.6);

  z-index: 1000;
`;

const Modal = styled.div`
  position: absolute;

  top: 120px;
  left: 50%;

  transform: translateX(-50%);

  width: 420px;

  background: #101728;
  border-radius: 20px;

  padding: 2rem;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  color: white;
`;

const Description = styled.p`
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.8);
`;

const CodeInput = styled.input`
  width: 90%;

  padding: 0.9rem 1rem;

  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);

  background: rgba(255, 255, 255, 0.06);
  color: white;

  font-size: 1rem;

  outline: none;

  &:focus {
    border-color: #9ecbff;
  }
`;

const ErrorText = styled.p`
  margin-top: 1rem;
  color: #ff8b8b;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  margin-top: 2rem;
`;

const BaseButton = styled.button`
  border: none;
  border-radius: 12px;

  padding: 0.8rem 1.2rem;

  cursor: pointer;

  font-size: 0.95rem;
  font-weight: 600;

  transition: 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(BaseButton)`
  background: rgba(255, 255, 255, 0.08);
  color: white;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.14);
  }
`;

const PrimaryButton = styled(BaseButton)`
  background: #9ecbff;
  color: #07111f;

  &:hover:not(:disabled) {
    background: #b6d8ff;
  }
`;
