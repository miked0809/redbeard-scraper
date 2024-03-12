"use client";

import { CountyUrl } from "@/services/constants";
import { Button } from "@/components/ui/button";
import { invokeScraper } from "./_invokeScraper";
import { useTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
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
  county: z.string({
    required_error: "Please select a county website to scrape.",
  }),
  ownername: z.string().min(1, {
    message: "Ownername is required.",
  }),
});

export default function ScraperForm() {
  const [scrapedData, setScrapedData] = useState({});
  const [selectedCounty, setSelectedCounty] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      county: "",
      ownername: "",
    },
  });

  function onSubmit(values) {
    console.log("onSubmit() values:", values);
    setSelectedCounty(values.county);
    setSelectedUrl(CountyUrl[values.county]);

    startScraper(() => {
      invokeScraper(values.county, values.ownername).then((data) => {
        setScrapedData(data);
        if (Object.keys(data).length === 0) {
          toast("No results found, search again", {
            duration: 10000,
          });
        }
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
                    name="county"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>County</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Delaware">
                              Delaware County
                            </SelectItem>
                            {/* <SelectItem value="Fairfield">
                              Fairfield County
                            </SelectItem> */}
                            <SelectItem value="Madison">
                              Madison County
                            </SelectItem>
                            <SelectItem value="Union">Union County</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="dark:text-yellow-300" />
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
                          <Textarea
                            placeholder="Enter each name on a new line (lastname firstname)"
                            className="w-[400px] min-h-[24px]"
                            {...field}
                          />
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
