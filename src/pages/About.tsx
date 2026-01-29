import styled from "styled-components";
import PageBackground from "../components/PageBackground";

/* ---------- Layout ---------- */

const Page = styled.div`
  max-width: 900px;
  margin: 120px auto 80px auto;
  padding: 0 24px;
  color: white;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 34px;
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

export default function About() {
  return (
    <>
      <PageBackground src="/ui/bg5.jpg" overlay />

      <Page>
        <Title>A Note from the Author ✨</Title>

        <Card>
          <Paragraph>Hello, young explorers!</Paragraph>

          <Paragraph>
            My name is <strong>Tania Karageorgi</strong>, and I have spent my
            life learning about the amazing world of life on Earth. I studied
            Biology and Environmental Science in London and Edinburgh, and I
            have worked with animals, plants, and people to understand how life
            survives and thrives.
          </Paragraph>

          <Paragraph>
            But what I have always loved most is <strong>teaching</strong> —
            helping children discover the secrets of nature in ways that feel
            exciting, meaningful, and full of wonder. From the tiniest insects
            to the largest oceans, from deserts to forests, everything in our
            world is connected — and every discovery can feel like magic.
          </Paragraph>

          <Paragraph>
            Today, I also work as a <strong>software engineer</strong>, which
            allows me to create new kinds of learning experiences.{" "}
            <em>The Cosmic Travellers</em> is not only a story series I wrote,
            but also the digital world I designed and built, so that stories,
            science, and imagination can come together in a gentle and
            interactive way. Even though my tools now include technology, my
            love for Biology, nature, and teaching has never changed — it is the
            heart of everything I create.
          </Paragraph>

          <Paragraph>
            This series began with my own child. When my son was very young, we
            would talk about flowers, fruits, animals, and rivers, asking simple
            questions and imagining the incredible stories behind them. I saw
            how curiosity grows when children are invited to wonder and explore,
            and how even big scientific ideas can become clear through
            imagination and conversation.
          </Paragraph>

          <Paragraph>
            In these stories, you will meet brave young travellers, journey
            across deserts, oceans, forests, and skies, and discover how water,
            plants, animals — and even people — are all connected. You will
            solve riddles, try little experiments, and earn golden shells
            alongside our heroes. You are not just reading —{" "}
            <strong>you are part of the adventure</strong>.
          </Paragraph>

          <Paragraph>
            Remember: science is full of magic, and your curiosity is the key to
            unlocking it.
          </Paragraph>

          <Paragraph>Ready to explore? Let’s go!</Paragraph>

          <Signature>— Tania Karageorgi</Signature>
        </Card>
      </Page>
    </>
  );
}
