"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllWords } from "@/services/wordService";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { toast } from "sonner";
import { Progress } from "@heroui/progress";
import BlurText from "@/components/BlurText";

export default function FlashCard() {
  const [flipped, setFlipped] = useState(false);
  const [words, setWords] = useState<any[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const currentWord = words[currentWordIndex] ?? null;

  useEffect(() => {
    async function fetchWords() {
      try {
        const result = await getAllWords();
        const shuffled = result.sort(() => Math.random() - 0.5);
        setWords(shuffled);
        setCurrentWordIndex(0);
      } catch (error) {
        console.error("Kelimeler getirilemedi:", error);
      }
    }
    fetchWords();
  }, []);

  const handleCardClick = () => {
    if (!flipped) {
      setFlipped(true);
    } else {
      setFlipped(false);
      setTimeout(() => {
        goToNextWord();
      }, 600);
    }
  };

  const goToNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    } else {
      toast.success("Shown all words!");
      const reshuffled = [...words].sort(() => Math.random() - 0.5);
      setWords(reshuffled);
      setCurrentWordIndex(0);
    }
  };

  const progress = words.length
    ? ((currentWordIndex + 1) / words.length) * 100
    : 0;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-6">
      <div className="rounded-4xl shadow-2xl bg-[#d6ccc2] flex justify-center items-center p-5">
        <BlurText
          text="Turn the Card Over, Learn Its Meaning!"
          delay={100}
          animateBy="words"
          direction="top"
          className="text-4xl font-bold"
        />
      </div>
      {/* Progress Bar */}
      <div className="w-full max-w-lg">
        <Progress
          value={progress}
          className="h-3 rounded-lg bg-[#8a817c] shadow-2xl"
        ></Progress>
      </div>

      {/* FlashCard */}
      <motion.div
        onClick={handleCardClick}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d", width: 480, height: 310 }}
        className="relative cursor-pointer shadow-2xl"
      >
        {/* Ön Yüz */}
        <Card
          className="absolute shadow-2xl w-full h-full bg-[#001233] text-white flex justify-center text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardHeader
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(
                currentWord.english
              );
              utterance.lang = "en-US";
              window.speechSynthesis.speak(utterance);
            }}
          >
            <CardTitle>
              <h4 className="text-4xl font-bold">
                {currentWord?.english ?? "Loading..."}
              </h4>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Arka Yüz */}
        <Card
          className="absolute w-full h-full bg-[#33415c] text-white flex flex-col justify-center text-center"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardHeader>
            <CardTitle>
              <h4 className="text-4xl font-bold">{currentWord?.turkish}</h4>
            </CardTitle>
          </CardHeader>
          {currentWord?.imageUrl && (
            <CardFooter className="flex justify-center items-center">
              <Image
                className="bg-[#E1D9C8] rounded-lg p-2"
                src={`http://localhost:5196${currentWord.imageUrl}`}
                alt={currentWord?.english}
                width={150}
                height={150}
              />
            </CardFooter>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
