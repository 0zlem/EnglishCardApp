"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllWords, getByIdword } from "@/services/wordService";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function Learn() {
  const [words, setWords] = useState<any[]>([]);
  const [currentWord, setCurrentWord] = useState<any>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      const allWords = await getAllWords();
      setWords(allWords);

      if (allWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * allWords.length);
        setCurrentWord(allWords[randomIndex]);
      }
    };

    fetchWords();
  }, []);

  useEffect(() => {
    if (!currentWord || words.length === 0) return;

    const otherOptions = words
      .filter((w) => w.id !== currentWord.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.english);

    const allOptions = [...otherOptions, currentWord.english].sort(
      () => Math.random() - 0.5
    );

    setOptions(allOptions);
  }, [currentWord, words]);

  useEffect(() => {
    if (isCorrect) {
      const nextWord = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentWord(words[randomIndex]);
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1500);
      return () => clearTimeout(nextWord);
    }
  }, [isCorrect]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    const correct = option === currentWord.english;
    setIsCorrect(correct);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-6">
      {currentWord && (
        <Card className="shadow-2xl shadow-accent-foreground border-none bg-[#8a817c] w-[580px] h-[410px]">
          <CardHeader>
            <CardTitle className="text-center font-bold text-2xl pt-7">
              {currentWord.turkish}
            </CardTitle>
            <div>
              <h1 className="text-start text-lg font-bold">
                What is the English meaning of the word?
              </h1>
            </div>
            <CardAction>
              <Image
                className="bg-[#E1D9C8] rounded-lg p-2"
                src={`http://localhost:5196${currentWord.imageUrl}`}
                alt={currentWord.turkish}
                width={150}
                height={150}
              />
            </CardAction>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 justify-center items-start mt-10">
            {options.map((opt, index) => (
              <div key={index}>
                <Button
                  onClick={() => {
                    handleSelect(opt);
                    const utterance = new SpeechSynthesisUtterance(opt);
                    utterance.lang = "en-US";
                    window.speechSynthesis.speak(utterance);
                  }}
                  className={`bg-[#E1D9C8] hover:bg-[#E1D9C8] rounded-lg p-8 cursor-pointer text-black w-full font-bold ${
                    selectedOption === opt
                      ? isCorrect
                        ? "bg-emerald-600 hover:bg-emerald-800"
                        : "bg-red-600 hover:bg-red-800"
                      : "hover:bg-[#C0BBAA]"
                  }`}
                >
                  {String.fromCharCode(97 + index).toUpperCase()}. {opt}{" "}
                  {/* a., b., c., d. */}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
