import { useState, useRef, useEffect } from "react";
import styled from "styled-components";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const OPTIONS = [
  { value: "en", label: "English" },
  { value: "el", label: "Ελληνικά" },
  { value: "de", label: "Deutsch" },
];

export default function LanguageSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = OPTIONS.find((o) => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Wrapper ref={ref}>
      <Trigger onClick={() => setOpen((o) => !o)} aria-haspopup="listbox">
        <Star>✦</Star>
        <Label>{current?.label}</Label>
        <Chevron $open={open}>▾</Chevron>
      </Trigger>

      {open && (
        <Dropdown role="listbox">
          {OPTIONS.map((option) => (
            <Option
              key={option.value}
              $active={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
            >
              {option.label}
            </Option>
          ))}
        </Dropdown>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  cursor: pointer;

  color: white;
  font-weight: 600;

  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.18),
    0 0 14px rgba(120, 180, 255, 0.18);

  transition:
    transform 200ms ease,
    filter 200ms ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.08);
  }
`;

const Star = styled.span`
  font-size: 0.75rem;
  text-shadow: 0 0 10px rgba(120, 180, 255, 0.6);
`;

const Label = styled.span`
  min-width: 70px;
  text-align: left;
`;

const Chevron = styled.span<{ $open: boolean }>`
  margin-left: 4px;
  transition: transform 200ms ease;
  transform: ${({ $open }) => ($open ? "rotate(180deg)" : "rotate(0)")};
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;

  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(14px);
  border-radius: 16px;
  padding: 8px;
  min-width: 160px;

  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.35),
    0 0 20px rgba(120, 180, 255, 0.15);

  animation: fadeIn 180ms ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Option = styled.div<{ $active?: boolean }>`
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  color: white;

  background: ${({ $active }) =>
    $active ? "rgba(120,180,255,0.25)" : "transparent"};

  &:hover {
    background: rgba(120, 180, 255, 0.2);
  }
`;
