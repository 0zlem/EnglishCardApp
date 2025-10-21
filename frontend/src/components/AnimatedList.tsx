import React, {
  useRef,
  useState,
  useEffect,
  ReactNode,
  MouseEventHandler,
  UIEvent,
} from "react";
import { motion, useInView } from "motion/react";
import { deleteWord, WordItem } from "@/services/wordService";
import Image from "next/image";
import { Button } from "@heroui/button";
import { HiSpeakerWave } from "react-icons/hi2";
import { toast } from "sonner";

interface AnimatedItemProps {
  onWordDeleted?: () => void;
  children: ReactNode;
  delay?: number;
  index: number;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  delay = 0,
  index,
  onMouseEnter,
  onClick,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: false });
  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

interface AnimatedListProps {
  onWordDeleted?: () => void;
  items?: WordItem[];
  onItemSelect?: (item: WordItem, index: number) => void;
  showGradients?: boolean;
  enableArrowNavigation?: boolean;
  className?: string;
  itemClassName?: string;
  displayScrollbar?: boolean;
  initialSelectedIndex?: number;
}

const AnimatedList: React.FC<AnimatedListProps> = ({
  onWordDeleted,
  items = [],
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] =
    useState<number>(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState<boolean>(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState<number>(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState<number>(1);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } =
      e.target as HTMLDivElement;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(
      scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1)
    );
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 0, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          onItemSelect?.(items[selectedIndex], selectedIndex);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(
      `[data-index="${selectedIndex}"]`
    ) as HTMLElement | null;
    if (selectedItem) {
      const extraMargin = 50;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;
      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (
        itemBottom >
        containerScrollTop + containerHeight - extraMargin
      ) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  if (items.length === 0) return null;

  const headers: (keyof WordItem)[] = [
    "English",
    "Turkish",
    "Example Sentence",
    "Image",
  ];

  const handleDeleteWord = async (itemId: string) => {
    const result = await deleteWord(itemId);
    console.log("Silinecek kelimenin Id'si:", itemId);
    if (result.isSuccessful) {
      toast.success("Kelime silindi!");
      onWordDeleted?.();
    } else {
      toast.error("Silme başarısız: " + result.message);
    }
  };

  return (
    <div className={`relative ${className} `}>
      {/* Başlıklar */}
      <div className="bg-[#001233] p-4 rounded-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-2 font-bold text-white">
        {headers.map((header) => (
          <div
            key={header}
            className="text-center border-4 border-[#33415c] p-1 rounded-lg"
          >
            {header}
          </div>
        ))}
      </div>

      {/* Veriler */}
      <div
        ref={listRef}
        className={`max-h-[600px] sm:max-h-[700px] overflow-y-auto ${
          displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[8px] [&::-webkit-scrollbar-track]:bg-[#E1D9C8] [&::-webkit-scrollbar-thumb]:bg-[#C0BBAA] [&::-webkit-scrollbar-thumb]:rounded-[4px]"
            : "scrollbar-hide"
        }`}
        onScroll={handleScroll}
        style={{
          scrollbarWidth: displayScrollbar ? "thin" : "none",
          scrollbarColor: "#735751 #a78a7f",
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={index}
            index={index}
            onMouseEnter={() => setSelectedIndex(index)}
            onClick={() => onItemSelect?.(item, index)}
          >
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 min-h-[32] justify-center items-center rounded-lg cursor-text ${
                selectedIndex === index ? "bg-[#001233]" : "bg-[#33415c]"
              } ${itemClassName}`}
            >
              {Object.entries(item).map(([key, val], i) => {
                if (key.toLowerCase() === "id") return null;
                return (
                  <div
                    key={i}
                    className="text-center text-white flex justify-center items-center gap-2"
                  >
                    {key === "imageUrl" && val ? (
                      <Image
                        width={80}
                        height={80}
                        src={`http://localhost:5196${val}`}
                        alt={item.English || "Word image"}
                        className="object-cover overflow-hidden rounded-md"
                      />
                    ) : key === "english" || key === "exampleSentence" ? (
                      <div className="flex items-center gap-2">
                        <span>{val as string}</span>
                        <Button
                          type="button"
                          onClick={() => {
                            const utterance = new SpeechSynthesisUtterance(
                              val as string
                            );
                            utterance.lang = "en-US";
                            window.speechSynthesis.speak(utterance);
                          }}
                          className="inline-flex h-8 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                        >
                          <HiSpeakerWave />
                        </Button>
                      </div>
                    ) : (
                      <span>{val as string}</span>
                    )}
                  </div>
                );
              })}
              <div>
                <Button
                  onClick={() => handleDeleteWord(item.id)}
                  className="relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#ff4728_0%,#6a2312_50%,#ff4721_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-[#350e04] px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                    Delete
                  </span>
                </Button>
              </div>
            </div>
          </AnimatedItem>
        ))}
      </div>

      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[50px] bg-gradient-to-b to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t to-transparent pointer-events-none transition-opacity duration-300 ease"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedList;
