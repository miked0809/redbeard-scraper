"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { invokeScraper } from "./_invokeScraper";
import { useTransition } from "react";
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
import { useRouter } from "next/navigation";
const formSchema = z.object({
  ownername: z.string().min(1, {
    message: "Ownername is required.",
  }),
});

let isLoaded = false;

export default function ScraperForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownername: "",
    },
  });

  function onSubmit(values) {
    startScraper(() => {
      invokeScraper(values.ownername);
      isLoaded = true;
    });
  }

  const [isPending, startScraper] = useTransition();

  if (isPending) {
    return (
      <>
        <div>Scraping data, please wait...</div>
      </>
    );
  }

  const navigate = () => {
    isLoaded = false;
    router.push("/results");
  };
  return (
    <>
      {!isPending && !isLoaded && (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 text-center"
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
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </>
      )}

      {!isPending && isLoaded && navigate()}
    </>
  );
}
