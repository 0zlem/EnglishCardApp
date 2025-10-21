"use client";
import AnimatedList from "@/components/AnimatedList";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { getAllWords, WordItem } from "@/services/wordService";
import { useEffect, useState } from "react";

export default function Word() {
  const [items, setItems] = useState<WordItem[]>([]);

  const fetchWords = async () => {
    const data = await getAllWords();
    setItems(data);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 bg-[#C0BBAA] rounded-3xl m-16">
        <h2 className="flex justify-center font-bold text-3xl pt-10 mx-0 my-0">
          Create Word
        </h2>
        <HoverEffect onWordCreated={fetchWords} />
      </div>

      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 bg-[#C0BBAA] rounded-3xl my-8">
        <h2 className="text-center font-bold text-3xl pt-10 mb-5">Words</h2>
        <AnimatedList
          onWordDeleted={fetchWords}
          items={items}
          onItemSelect={(item, index) => console.log(item, index)}
          showGradients={true}
          enableArrowNavigation={true}
          displayScrollbar={true}
          className="bg-transparent w-full"
        />
      </div>
    </div>
  );
}
