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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ScrapedDataDisplay from "./_scrapedDataDisplay";
const formSchema = z.object({
  url: z.string({
    required_error: "Please select a county website to scrape.",
  }),
  ownername: z.string().min(1, {
    message: "Ownername is required.",
  }),
});

const CountyUrl = {
  Madison: "https://auditor.co.madison.oh.us/Search",
  Delaware: "",
  Fairfield: "",
  Union: "",
};

export default function ScraperForm() {
  const [scrapedData, setScrapedData] = useState({});
  const [selectedCounty, setSelectedCounty] = useState("Madison");
  const [selectedUrl, setSelectedUrl] = useState(CountyUrl.Madison);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "Madison",
      ownername: "",
    },
  });

  function onSubmit(values) {
    console.log("onSubmit() values:", values);
    setSelectedCounty(values.url);
    setSelectedUrl(CountyUrl[values.url]);

    startScraper(() => {
      invokeScraper(CountyUrl[values.url], values.ownername).then((data) => {
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
          {Object.keys(scrapedData).length === 0 && (
            <div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8 text-center mb-4"
                >
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>County</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Madison">
                              Madison County
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
            </div>
          )}

          {Object.keys(scrapedData).length > 0 && (
            <Button type="button" variant="ghost" onClick={handleReset}>
              Search Again
            </Button>
          )}

          <ScrapedDataDisplay
            scrapedData={scrapedData}
            selectedCounty={selectedCounty}
            selectedUrl={selectedUrl}
          />
        </>
      )}
    </>
  );
}
