"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllWords } from "@/services/wordService";
import { toast } from "sonner";

type CardType = {
  id: string;
  content: string;
  matched: boolean;
  type: "en" | "tr";
};

export default function Match() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [firstSelection, setFirstSelection] = useState<CardType | null>(null);
  const [secondSelection, setSecondSelection] = useState<CardType | null>(null);
  const [disableClicks, setDisableClicks] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ← loading state

  const resetGame = async () => {
    setIsLoading(true); // yüklenmeye başla
    setCards([]);
    setFirstSelection(null);
    setSecondSelection(null);
    setDisableClicks(false);

    try {
      const allWords = await getAllWords();
      if (!allWords || allWords.length === 0) return;

      const selected = allWords.sort(() => 0.5 - Math.random()).slice(0, 6);

      let newCards: CardType[] = [];
      selected.forEach((w) => {
        newCards.push({
          id: w.id,
          content: w.english,
          type: "en",
          matched: false,
        });
        newCards.push({
          id: w.id,
          content: w.turkish,
          type: "tr",
          matched: false,
        });
      });

      newCards = newCards.sort(() => Math.random() - 0.5);
      setCards(newCards);
    } catch (error) {
      console.error("Kelimeler getirilemedi:", error);
      toast.error("Error loading words!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetGame();
  }, []);

  useEffect(() => {
    if (cards.length > 0 && cards.every((c) => c.matched)) {
      toast.success("Congratulations! You found all the matches 🎉");
      setTimeout(() => {
        resetGame();
      }, 5000);
    }
  }, [cards]);

  const handleCardClick = (card: CardType) => {
    if (disableClicks || card.matched || isLoading) return;

    const resetSelections = () => {
      setFirstSelection(null);
      setSecondSelection(null);
      setDisableClicks(false);
    };

    if (!firstSelection) {
      setFirstSelection(card);
      return;
    }

    if (!secondSelection && card !== firstSelection) {
      setSecondSelection(card);
      setDisableClicks(true);

      if (firstSelection.id === card.id && firstSelection.type !== card.type) {
        setCards((prev) =>
          prev.map((c) => (c.id === card.id ? { ...c, matched: true } : c))
        );
        setTimeout(() => resetSelections(), 800);
      } else {
        setTimeout(() => resetSelections(), 1000);
      }
    }
  };

  const isFlipped = (card: CardType) =>
    card.matched || card === firstSelection || card === secondSelection;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h2 className="text-2xl font-bold mb-4">Match the Words!</h2>

      {isLoading ? (
        <div className="text-white text-lg font-bold">Loading...</div>
      ) : (
        <div className="grid grid-cols-4 gap-4 max-w-2xl w-full">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              layout
              onClick={() => handleCardClick(card)}
              className={`aspect-square rounded-lg cursor-pointer shadow-lg flex items-center justify-center text-lg font-bold text-black ${
                isFlipped(card)
                  ? "bg-linear-to-tr from-[#735d78] to-[#b8bedd]"
                  : "bg-[#001233]"
              }`}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {isFlipped(card) && (
                  <motion.span
                    key={`${card.id}-${card.type}`}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: 0 }}
                    exit={{ rotateY: 180 }}
                    className="absolute text-center px-2 text-white font-bold"
                  >
                    {card.content}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
