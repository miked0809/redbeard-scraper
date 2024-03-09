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
          <div className="mt-8 border p-4">
            <div id="section-to-print">
              <div className="w-full flex justify-between">
                <h2 className="text-xl font-bold mb-8">
                  {selectedCounty} County
                </h2>
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
                <TableCaption>
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
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell>{row.address}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          {process.env.DEV_MODE === "true" && (
            <div className="mx-auto border p-10">
              <pre>{JSON.stringify(scrapedData, null, 2)}</pre>
            </div>
          )}
        </>
      )}
    </>
  );
}
