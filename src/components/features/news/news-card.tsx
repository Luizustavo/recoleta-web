"use client";

import React from "react";
import Image from "next/image";

// Suporte tanto para mock quanto para GNews
export type NewsCardProps = {
  item: {
    title: string;
    image: string;
    excerpt?: string;
    description?: string;
    date?: string;
    publishedAt?: string;
    tag?: string;
    url?: string;
    sourceName?: string;
  };
};

export function NewsCard({ item }: NewsCardProps) {
  const link = item.url;
  const desc = item.excerpt || item.description;
  const date = item.date || item.publishedAt;
  let formattedDate: string | undefined = undefined;
  if (date) {
    try {
      const d = new Date(date);
      formattedDate = d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      formattedDate = date;
    }
  }
  return (
    <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="h-44 w-full bg-gray-200 relative">
        {item.image && /^https?:\/\//i.test(item.image) ? (
          // External image — fallback to native img to avoid Next image hostname config error
          // keep same styling as next/image
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <Image src={item.image || "/images/login-page-image.webp"} alt={item.title} fill className="object-cover" />
        )}
      </div>
      <div className="p-4 flex flex-col h-full">
        <div className="mb-2">
          {item.tag && (
            <div className="mb-1">
              <span className="inline-block text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {item.tag}
              </span>
            </div>
          )}
          <h3 className="text-lg font-semibold text-slate-900">
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline text-green-800">
                {item.title}
              </a>
            ) : (
              item.title
            )}
          </h3>
        </div>
        {desc && <p className="text-sm text-slate-600 mb-2 line-clamp-3">{desc}</p>}
        {formattedDate && <time className="text-xs text-slate-400">{formattedDate}</time>}
        {item.sourceName && link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="mt-2 text-xs text-blue-700 hover:underline">
            Fonte: {item.sourceName}
          </a>
        )}
      </div>
    </article>
  );
}

export default NewsCard;
