import TextPage from "../components/TextPage";
import { artCreditsParagraphs } from "../data/texts/texts";

export default function Credits() {
  return (
    <TextPage
      bgSrc="/ui/bg5.jpg"
      title="Art & Visual Credits to Ioustini Giannakopoulou ✨"
      paragraphs={artCreditsParagraphs}
      signature="-Tania Karageorgi"
    />
  );
}
