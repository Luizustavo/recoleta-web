

export type NewsItem = {
  id: string;
  title: string;
  date?: string;
  excerpt?: string;
  image: string;
  tag?: string;
  url?: string;
  sourceName?: string;
};

export default function useMockedNews() {
  const news: NewsItem[] = [
    {
      id: "1",
      title: "Comunidades locais restauram 5 hectares de mata atlântica",
      date: "2025-10-21",
      excerpt:
        "Voluntários e ONGs uniram forças para recuperar áreas degradadas e reintroduzir espécies nativas.",
      image: "/images/login-page-image.webp",
      tag: "Restauração",
    },
    {
      id: "2",
      title: "Energia solar aumenta 40% em pequenas cidades",
      date: "2025-09-10",
      excerpt:
        "Projetos públicos e privados reduziram custos e ampliaram o acesso à energia limpa.",
      image: "/images/login-page-image.webp",
      tag: "Energia",
    },
    {
      id: "3",
      title: "Iniciativa de reciclagem transforma resíduos em renda",
      date: "2025-08-02",
      excerpt:
        "Cooperativas locais criam cadeia de valor a partir de materiais recicláveis coletados na cidade.",
      image: "/images/login-page-image.webp",
      tag: "Reciclagem",
    },
    {
      id: "4",
      title: "Proteção de manguezais evita erosão costeira",
      date: "2025-07-18",
      excerpt:
        "Estudos mostram que a preservação de manguezais diminui danos durante tempestades e protege biodiversidade.",
      image: "/images/login-page-image.webp",
      tag: "Costeiro",
    },
    {
      id: "5",
      title: "Agricultura regenerativa recupera solo e aumenta produtividade",
      date: "2025-06-30",
      excerpt:
        "Produtores adotam técnicas que restauram a fertilidade do solo ao mesmo tempo que sequestram carbono.",
      image: "/images/login-page-image.webp",
      tag: "Agricultura",
    },
    {
      id: "6",
      title: "Jovens lideram mutirões de limpeza em rios urbanos",
      date: "2025-05-12",
      excerpt:
        "Ações educativas e de limpeza coletam toneladas de resíduos e sensibilizam a população.",
      image: "/images/login-page-image.webp",
      tag: "Ação",
    },
    {
      id: "7",
      title: "Projeto de compostagem reduz lixo orgânico em escolas",
      date: "2025-04-10",
      excerpt:
        "Alunos e professores implementam composteiras e transformam resíduos em adubo para hortas escolares.",
      image: "/images/login-page-image.webp",
      tag: "Compostagem",
    },
    {
      id: "8",
      title: "Cidade planta 10 mil árvores em mutirão anual",
      date: "2025-03-15",
      excerpt:
        "Ação coletiva mobiliza moradores e empresas para ampliar áreas verdes urbanas.",
      image: "/images/login-page-image.webp",
      tag: "Reflorestamento",
    },
  ];

  return { news };
}
