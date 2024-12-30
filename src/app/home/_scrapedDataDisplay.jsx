import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, MoveUpRight } from "lucide-react";
import Link from "next/link";

export default function ScrapedDataDisplay({
  scrapedData,
  selectedCounty,
  selectedUrl,
}) {
  return (
    <>
      {Object.keys(scrapedData).length > 0 && (
        <>
          {selectedCounty === "Franklin" &&
            Object.keys(scrapedData).length === 50 && (
              <div className="text-destructive">
                *For Franklin County, a max of 50 results are displayed (there
                could be more)
              </div>
            )}
          <div className="mt-2 border p-4">
            <div id="section-to-print">
              <div className="w-full flex justify-between">
                <h2 className="text-xl font-bold mb-8">
                  {selectedCounty} County
                </h2>
                <div>
                  {scrapedData.length +
                    (scrapedData.length === 1 ? " result" : " results")}
                </div>
                <Button
                  id="printButton"
                  variant="outline"
                  onClick={() => print()}
                  className="-mt-[6px] p-2"
                  title="Print"
                >
                  <Printer />
                </Button>
              </div>

              <Table>
                <TableCaption className="whitespace-nowrap">
                  <Link
                    href={selectedUrl}
                    target="_blank"
                    className="hover:underline"
                  >
                    {selectedUrl}
                    <span className="inline-flex">
                      <MoveUpRight className="size-[14px]" />
                    </span>
                  </Link>
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scrapedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {row.name}
                        {row.name2 ? ", " + row.name2 : ""}
                      </TableCell>
                      <TableCell>{row.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </>
  );
}
