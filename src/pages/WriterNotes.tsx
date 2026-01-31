import TextPage from "../components/TextPage";
import { writerNotesParagraphs } from "../data/texts/texts";

export default function WriterNotes() {
  return (
    <TextPage
      bgSrc="/ui/bg5.jpg"
      title="A Note from the Author ✨"
      paragraphs={writerNotesParagraphs}
      signature="-Tania Karageorgi"
    />
  );
}
