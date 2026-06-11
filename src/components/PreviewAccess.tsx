import { useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import { redeemPreviewCode } from "../requests";
import { Trigger } from "../theme/sharedStyled";
import { useUserState } from "../contexts/userContext";

export function PreviewAccess() {
  const {
    isPreviewAccessModalOpen,
    setIsPreviewAccessModalOpen,
    setUnlockedBooksLocal,
  } = useUserState();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isRedeeming, setIsRedeeming] = useState(false);

  const handleClose = () => {
    setIsPreviewAccessModalOpen(false);
    setCode("");
    setError("");
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setIsRedeeming(true);

      const data = await redeemPreviewCode(code.trim());

      if (data?.unlocked_books) {
        setUnlockedBooksLocal(data.unlocked_books);
      }

      handleClose();
    } catch (error) {
      console.error(error);
      setError("That code did not work.");
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <>
      <Trigger
        type="button"
        onClick={() => setIsPreviewAccessModalOpen(true)}
        width={"40%"}
        minimal
      >
        Preview Access
      </Trigger>

      {isPreviewAccessModalOpen &&
        createPortal(
          <ModalPortalContent
            code={code}
            error={error}
            isRedeeming={isRedeeming}
            onCodeChange={setCode}
            onClose={handleClose}
            onSubmit={handleSubmit}
          />,
          document.body,
        )}
    </>
  );
}

type ModalPortalContentProps = {
  code: string;
  error: string;
  isRedeeming: boolean;
  onCodeChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

function ModalPortalContent({
  code,
  error,
  isRedeeming,
  onCodeChange,
  onClose,
  onSubmit,
}: ModalPortalContentProps) {
  return (
    <ModalBackdrop onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>Preview Access</Title>

        <Description>Enter your preview code to unlock the books.</Description>

        <CodeInput
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder="Enter code"
          autoFocus
        />

        {!!error && <ErrorText>{error}</ErrorText>}

        <Actions>
          <SecondaryButton type="button" onClick={onClose}>
            Cancel
          </SecondaryButton>

          <PrimaryButton
            type="button"
            onClick={onSubmit}
            disabled={!code.trim() || isRedeeming}
          >
            {isRedeeming ? "Unlocking..." : "Unlock Books"}
          </PrimaryButton>
        </Actions>
      </Modal>
    </ModalBackdrop>
  );
}
const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 1rem;
  box-sizing: border-box;

  background: rgba(0, 0, 0, 0.65);
`;

const Modal = styled.div`
  width: min(92vw, 420px);
  box-sizing: border-box;

  background: #101728;
  border-radius: 20px;
  padding: 2rem;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
`;

const CodeInput = styled.input`
  width: 100%;
  box-sizing: border-box;

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

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  margin-top: 2rem;

  @media (max-width: 420px) {
    flex-direction: column-reverse;
  }
`;

const BaseButton = styled.button`
  border: none;
  border-radius: 12px;

  padding: 0.8rem 1.2rem;
  box-sizing: border-box;

  cursor: pointer;

  font-size: 0.95rem;
  font-weight: 600;

  transition: 0.2s ease;

  @media (max-width: 420px) {
    width: 100%;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Title = styled.h2`
  margin: 0 0 1rem;
  color: white;
`;

const Description = styled.p`
  margin: 0 0 1.5rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ErrorText = styled.p`
  margin-top: 1rem;
  color: #ff8b8b;
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
