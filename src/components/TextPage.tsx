import styled from "styled-components";
import PageBackground from "../components/PageBackground";

/* ---------- Layout ---------- */

const Page = styled.div`
  max-width: 900px;
  margin: 120px auto 80px auto;
  padding: 0 24px;
  color: ${({ theme }) => theme.colors.ink};
`;

const Title = styled.h1`
  text-align: center;
  font-size: clamp(24px, 3.4vw, 34px);
  margin-bottom: 24px;

  text-shadow:
    0 0 6px rgba(255, 255, 255, 0.8),
    0 0 16px rgba(120, 180, 255, 0.5);
`;

/* ---------- Content Card ---------- */

const Card = styled.div`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 36px 32px;
  line-height: 1.8;
  font-size: 17px;

  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
`;

const Paragraph = styled.p`
  margin: 16px 0;
  opacity: 0.95;
`;

const Signature = styled.p`
  margin-top: 36px;
  font-style: italic;
  text-align: right;
  opacity: 0.9;
`;

/* ---------- Component ---------- */

interface ITextPageProps {
  title: string;
  paragraphs: string[];
  bgSrc: string;
  signature?: string;
}

export default function TextPage({
  title,
  paragraphs,
  bgSrc,
  signature,
}: ITextPageProps) {
  return (
    <>
      <PageBackground src={bgSrc} overlay />

      <Page>
        <Title>{title}</Title>

        <Card>
          {paragraphs.map((item, index) => {
            return <Paragraph key={index}>{item}</Paragraph>;
          })}

          {signature && <Signature>— Tania Karageorgi</Signature>}
        </Card>
      </Page>
    </>
  );
}
