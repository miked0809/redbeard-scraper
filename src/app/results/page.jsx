import Link from "next/link";
import ScrapedData from "./_scrapedData";

export default function Results() {
  return (
    <>
      <div className="border rounded-lg dark:bg-white dark:text-black dark:hover:bg-gray-100 hover:bg-gray-700 bg-black text-white p-4 mb-10">
        <Link href="/" className="size-full p-4">
          Search Again
        </Link>
      </div>

      <ScrapedData />
    </>
  );
}
