export default function ScrapedDataDisplay({ scrapedData }) {
  return (
    <>
      {Object.keys(scrapedData).length > 0 && (
        <div className="mx-auto border p-10">
          <pre>{JSON.stringify(scrapedData, null, 2)}</pre>
        </div>
      )}
    </>
  );
}
