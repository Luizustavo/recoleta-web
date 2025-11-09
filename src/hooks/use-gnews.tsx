"use client";
import { useEffect, useState } from "react";

export type GNewsArticle = {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: { name: string; url: string };
};

export default function useGNews(query: string, max: number = 10) {
  const [articles, setArticles] = useState<GNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Coloque sua chave de API do GNews aqui
  const API_KEY = process.env.NEXT_PUBLIC_GNEWS_API_KEY || "";

  useEffect(() => {
    if (!API_KEY) {
      setError("API KEY do GNews não definida");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(
      `https://gnews.io/api/v4/search?q=${encodeURIComponent(
        query
      )}&lang=pt&max=${max}&token=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.articles) {
          setArticles(data.articles);
        } else {
          setError("Nenhum artigo encontrado");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro ao buscar notícias: " + err.message);
        setLoading(false);
      });
  }, [query, max, API_KEY]);

  return { articles, loading, error };
}
