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
import { Printer } from "lucide-react";

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
                  variant="ghost"
                  onClick={() => print()}
                  className="-mt-[6px]"
                  title="Print"
                >
                  <Printer />
                </Button>
              </div>

              <Table>
                <TableCaption>{selectedUrl}</TableCaption>
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
