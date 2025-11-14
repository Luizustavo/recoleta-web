
"use client";

import { Header } from "@/components/header/header";
import useMockedNews, { NewsItem } from "@/hooks/use-mocked-news";
import useGNews from "@/hooks/use-gnews";
import NewsCarousel from "@/components/features/news/news-carousel";
import NewsCard from "@/components/features/news/news-card";

export default function NewsPage() {
  // Busca notícias reais do GNews
  const { articles, loading, error } = useGNews("meio ambiente sustentabilidade", 10);
  // Fallback para mock se não houver artigos reais
  const { news } = useMockedNews();

  // Normaliza dados para o componente NewsCard/Carousel
  const realNews: NewsItem[] = articles.map((a, idx) => ({
    id: a.url || String(idx),
    title: a.title,
    image: a.image || "/images/login-page-image.webp",
    excerpt: a.description,
    date: a.publishedAt,
    tag: a.source?.name,
    url: a.url,
    sourceName: a.source?.name,
  }));
  // Adiciona campos opcionais para mock também
  const mockNews: NewsItem[] = news.map((n, idx) => ({
    ...n,
    url: n.url,
    sourceName: n.tag,
    id: n.id || String(idx),
  }));
  const allNews: NewsItem[] = realNews.length > 0 ? realNews : mockNews;
  const featured = allNews.slice(0, 3);
  let list = allNews.slice(3);

  // Garantir número par de cards para manter layout consistente
  if (list.length % 2 !== 0) {
    // tente usar uma notícia mock extra não utilizada
    const extraFromMock = mockNews.find((m) => !allNews.some((a) => a.id === m.id));
    if (extraFromMock) {
      list = list.concat(extraFromMock);
    } else {
      // fallback: duplicar o último item com novo id
      const last = list[list.length - 1];
      list = list.concat({ ...last, id: `${last.id}-dup` });
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Notícias Ambientais</h1>

        {loading && <p className="text-slate-500">Carregando notícias...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {/* Carrossel hero */}
  <NewsCarousel items={featured} />

        {/* Grid com todos os cards restantes */}
        <section className={`mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${Math.min(list.length, 5)} gap-6`}>
          {list.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </section>
      </div>
    </main>
  );
}

