"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { invokeScraper } from "./_invokeScraper";
import { useTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ScrapedDataDisplay from "./_scrapedDataDisplay";
const formSchema = z.object({
  ownername: z.string().min(1, {
    message: "Ownername is required.",
  }),
});

export default function ScraperForm() {
  const [scrapedData, setScrapedData] = useState({});

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownername: "",
    },
  });

  function onSubmit(values) {
    startScraper(() => {
      invokeScraper(values.ownername).then((data) => {
        console.log("onSubmit data: ", data);
        setScrapedData(data);
      });
    });
  }

  const handleReset = () => {
    setScrapedData({});
    form.reset();
  };

  const [isPending, startScraper] = useTransition();

  if (isPending) {
    return (
      <>
        <div>Scraping data, please wait...</div>
      </>
    );
  }

  return (
    <>
      {!isPending && (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-center mb-4"
            >
              <FormField
                control={form.control}
                name="ownername"
                render={({ field }) => (
                  <FormItem className="text-left">
                    <FormLabel>Owner Name (Last First)</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-[400px]" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-x-2">
                <Button type="submit">Submit</Button>
                <Button type="button" variant="ghost" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </Form>
          <ScrapedDataDisplay scrapedData={scrapedData} />
        </>
      )}
    </>
  );
}
