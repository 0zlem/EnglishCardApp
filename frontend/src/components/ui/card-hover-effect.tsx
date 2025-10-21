"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Input } from "./input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Button } from "@heroui/button";
import { useForm } from "react-hook-form";
import { createWord, WordItem } from "@/services/wordService";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  english: z.string().min(1),
  turkish: z.string().min(1),
  exampleSentence: z.string(),
  imageFile: z.any().optional(),
});

export const HoverEffect = ({
  className,
  onWordCreated,
}: {
  className?: string;
  onWordCreated?: () => void;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      english: "",
      turkish: "",
      exampleSentence: "",
      imageFile: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const formData = new FormData();
      formData.append("English", values.english);
      formData.append("Turkish", values.turkish);
      formData.append("ExampleSentence", values.exampleSentence);

      if (values.imageFile) {
        formData.append("ImageFile", values.imageFile);
      }

      await createWord(formData);
      toast.success("Kelime başarıyla eklendi!");
      form.reset();
      onWordCreated?.();
    } catch (error) {
      toast.error("Kelime eklenirken hata oluştu.");
      console.error(error);
    }
  }

  const items = [
    { title: "English", name: "english" },
    { title: "Turkish", name: "turkish" },
    {
      title: "Example Sentence",
      name: "exampleSentence",
    },
    { title: "Image", name: "imageFile" },
  ] as const;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6",
          className
        )}
      >
        {items.map((item, idx) => (
          <motion.div
            key={item.name}
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
            className="relative group block p-3"
          >
            <AnimatePresence>
              {hoveredIndex === idx && (
                <motion.span
                  className="absolute inset-0 h-full w-full bg-[#33415c] dark:bg-slate-800/[0.8] block rounded-3xl"
                  layoutId="hoverBackground"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: { duration: 0.15 },
                  }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 0.15, delay: 0.2 },
                  }}
                />
              )}
            </AnimatePresence>

            <Card>
              <CardTitle>{item.title}</CardTitle>
              <FormField
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {item.name === "imageFile" ? (
                        <Input
                          type="file"
                          accept="image/*"
                          className="text-white border-[#33415c] file:bg-[#33415c] file:text-white file:border-none file:px-3 file:py-1 file:rounded-md"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || undefined;
                            field.onChange(file ?? null);
                          }}
                          onBlur={field.onBlur}
                        />
                      ) : (
                        <Input
                          className="border-[#33415c] text-white"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>
          </motion.div>
        ))}
        <div className="col-span-full flex justify-center mt-4">
          <Button
            type="submit"
            className="bg-linear-to-tr from-[#735751] to-[#a78a7f] text-white shadow-lg rounded-lg"
            radius="full"
          >
            Create Word
          </Button>
        </div>
      </form>
    </Form>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl p-3 w-full overflow-hidden bg-[#001233] border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative",
        className
      )}
    >
      <div className="relative z-50 flex flex-col gap-2">{children}</div>
    </div>
  );
};

export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide h-10", className)}>
      {children}
    </h4>
  );
};
