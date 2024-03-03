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

const formSchema = z.object({
  ownername: z.string().min(1, {
    message: "Ownername is required.",
  }),
});

export default function ScraperForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ownername: "",
    },
  });

  function onSubmit(values) {
    startTransition(() => {
      invokeScraper(values.ownername);
    });
  }

  const [isPending, startTransition] = useTransition();

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="ownername"
            render={({ field }) => (
              <FormItem>
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
  );
}
