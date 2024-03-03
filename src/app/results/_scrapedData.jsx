import { fetchScrapedData } from "@/services/fetchScrapedData";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ScrapedData() {
  let scrapedData = await fetchScrapedData();

  return (
    <>
      <div className="mx-auto border p-10">
        <pre>{JSON.stringify(scrapedData, null, 2)}</pre>
      </div>
    </>
  );
}
