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

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Usar API route interna ao invés de chamar GNews diretamente
    fetch(`/api/news?q=${encodeURIComponent(query)}&max=${max}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setArticles([]);
        } else if (data.articles && Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          setError("Nenhum artigo encontrado");
          setArticles([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar notícias:", err);
        setError("Erro ao buscar notícias: " + err.message);
        setArticles([]);
        setLoading(false);
      });
  }, [query, max]);

  return { articles, loading, error };
}
