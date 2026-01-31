import TextPage from "../components/TextPage";
import type { TextPage as ITextPage } from "../data/books/text-pages";


export default function Credits({ data }: {data: ITextPage}) {
  return <TextPage {...data} />;
}
