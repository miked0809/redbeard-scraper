import { ModeToggle } from "@/components/mode-toggle";
import ScraperForm from "./_form";

export default function Home() {
  return (
    <>
      <nav>
        <div className="float-end m-4">
          <ModeToggle />
        </div>
      </nav>

      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <ScraperForm />
      </main>
    </>
  );
}
