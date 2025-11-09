"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { NewsItem } from "@/hooks/use-mocked-news";

export function NewsCarousel({ items }: { items: NewsItem[] }) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const timerRef = useRef<number | null>(null);
  const restartRef = useRef<number | null>(null);

  const startAutoAdvance = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 5000);
  }, [count]);

  const scheduleRestart = useCallback(() => {
    if (restartRef.current) window.clearTimeout(restartRef.current);
    // pause auto-advance for 8s after manual interaction
    if (timerRef.current) window.clearInterval(timerRef.current);
    restartRef.current = window.setTimeout(() => {
      startAutoAdvance();
    }, 8000);
  }, [startAutoAdvance]);

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (restartRef.current) window.clearTimeout(restartRef.current);
    };
  }, [startAutoAdvance]);

  function prev() {
    setIndex((i) => (i - 1 + count) % count);
    scheduleRestart();
  }
  function next() {
    setIndex((i) => (i + 1) % count);
    scheduleRestart();
  }

  if (!items.length) return null;

  return (
    <section className="w-full relative">
      <div className="h-64 md:h-96 w-full rounded-lg overflow-hidden relative">
        {/* Botão Anterior à esquerda */}
        <button
          aria-label="Anterior"
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 text-slate-800 rounded-full w-10 h-10 flex items-center justify-center shadow"
        >
          ‹
        </button>
        {/* Botão Próximo à direita */}
        <button
          aria-label="Próximo"
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 text-slate-800 rounded-full w-10 h-10 flex items-center justify-center shadow"
        >
          ›
        </button>
        {items.map((it, idx) => (
          <div
            key={it.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {it.url && (
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-20"
                aria-label={`Abrir fonte: ${it.title}`}
              />
            )}
            <div className="relative w-full h-full">
              {it.image && /^https?:\/\//i.test(it.image) ? (
                // external image — use native <img> to avoid next/image host config
                // eslint-disable-next-line @next/next/no-img-element
                <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
              ) : (
                <Image src={it.image || "/images/login-page-image.webp"} alt={it.title} fill className="object-cover" />
              )}
            </div>
            <div className="absolute left-4 bottom-6 bg-black/60 text-white p-4 rounded max-w-xl">
              <h2 className="text-xl font-bold">{it.title}</h2>
              <p className="text-sm mt-1">{it.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewsCarousel;
