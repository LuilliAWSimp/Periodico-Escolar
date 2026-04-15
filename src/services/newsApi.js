const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80";

const FALLBACK_MEXICO_NEWS = [
  {
    id: "mx-1",
    title: "México impulsa nuevos programas de innovación educativa en escuelas públicas",
    summary: "Autoridades educativas y gobiernos locales anunciaron líneas de apoyo para infraestructura digital, capacitación docente y recursos de aprendizaje.",
    content: "Distintas iniciativas nacionales y estatales continúan reforzando el uso de tecnología en centros educativos.",
    image: "https://images.unsplash.com/photo-1516383607781-913a19294fd1?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción nacional",
    author: "Redacción nacional",
    externalUrl: null,
    date: "12 abril 2026",
    featured: true,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 360
  },
  {
    id: "mx-2",
    title: "Crecen los proyectos juveniles de sostenibilidad en distintas regiones del país",
    summary: "Colectivos escolares y comunitarios participan en campañas de reciclaje, reforestación y cuidado del entorno urbano.",
    content: "En diferentes regiones del país se multiplican las iniciativas juveniles que promueven reciclaje y participación comunitaria.",
    image: "https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción nacional",
    author: "Redacción nacional",
    externalUrl: null,
    date: "11 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  },
  {
    id: "mx-3",
    title: "La agenda cultural para estudiantes amplía talleres y espacios de lectura",
    summary: "Bibliotecas, museos y centros culturales fortalecen su oferta para público joven con actividades gratuitas y de bajo costo.",
    content: "La oferta cultural dirigida a estudiantes incorpora nuevos talleres, exposiciones y actividades de lectura.",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción nacional",
    author: "Redacción nacional",
    externalUrl: null,
    date: "10 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  },
  {
    id: "mx-4",
    title: "Foros estudiantiles abren espacio a proyectos de emprendimiento con impacto social",
    summary: "Instituciones educativas comparten soluciones creadas por estudiantes para retos reales de sus comunidades.",
    content: "Las presentaciones recientes muestran un aumento en propuestas de emprendimiento social desarrolladas por estudiantes.",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción nacional",
    author: "Redacción nacional",
    externalUrl: null,
    date: "09 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  },
  {
    id: "mx-5",
    title: "Universidades y preparatorias fortalecen laboratorios de ciencia aplicada",
    summary: "Nuevos programas impulsan prácticas experimentales y colaboración entre docentes y estudiantes.",
    content: "Instituciones educativas anunciaron mejoras en infraestructura y equipamiento para áreas científicas.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción nacional",
    author: "Redacción nacional",
    externalUrl: null,
    date: "08 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  },
  {
    id: "mx-6",
    title: "Programas de lectura comunitaria suman nuevas sedes en el país",
    summary: "Promotores culturales y escuelas coordinan actividades abiertas para niñas, niños y jóvenes.",
    content: "La expansión del programa busca aumentar acceso a lectura y espacios culturales.",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción nacional",
    author: "Redacción nacional",
    externalUrl: null,
    date: "07 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  }
];

const FALLBACK_WORLD_NEWS = [
  {
    id: "world-1",
    title: "Organismos internacionales refuerzan alianzas en educación, ciencia e innovación",
    summary: "Nuevos acuerdos buscan ampliar oportunidades de aprendizaje, investigación y cooperación entre instituciones de varios países.",
    content: "Diversas instituciones internacionales continúan ampliando alianzas en educación, ciencia e innovación.",
    image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción internacional",
    author: "Redacción internacional",
    externalUrl: null,
    date: "12 abril 2026",
    featured: true,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 360
  },
  {
    id: "world-2",
    title: "Ciudades del mundo aceleran planes de movilidad sustentable y espacios verdes",
    summary: "Gobiernos locales presentan estrategias que combinan transporte limpio, urbanismo y bienestar comunitario.",
    content: "Las políticas urbanas recientes en distintas ciudades del mundo incorporan soluciones de movilidad sustentable.",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción internacional",
    author: "Redacción internacional",
    externalUrl: null,
    date: "11 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  },
  {
    id: "world-3",
    title: "La cooperación científica internacional acelera proyectos de salud y tecnología",
    summary: "Universidades y centros de investigación comparten avances y metodologías para responder a retos globales.",
    content: "La colaboración científica internacional sigue impulsando investigaciones en salud y tecnología.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción internacional",
    author: "Redacción internacional",
    externalUrl: null,
    date: "10 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  },
  {
    id: "world-4",
    title: "Plataformas culturales conectan a jóvenes creadores de distintos países",
    summary: "Festivales, convocatorias y espacios digitales refuerzan el intercambio artístico internacional.",
    content: "Diversas plataformas culturales han ampliado la circulación de obras y encuentros entre jóvenes creadores.",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción internacional",
    author: "Redacción internacional",
    externalUrl: null,
    date: "09 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  },
  {
    id: "world-5",
    title: "Programas globales de alfabetización digital ganan impulso",
    summary: "Escuelas y organizaciones colaboran para ampliar acceso a competencias tecnológicas.",
    content: "Nuevos convenios internacionales buscan ampliar recursos de aprendizaje digital.",
    image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción internacional",
    author: "Redacción internacional",
    externalUrl: null,
    date: "08 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  },
  {
    id: "world-6",
    title: "Redes de investigación educativa comparten nuevos hallazgos internacionales",
    summary: "Centros académicos publican resultados sobre innovación pedagógica y evaluación.",
    content: "La cooperación internacional sigue fortaleciendo el intercambio de metodologías y evidencia.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    source: "Redacción internacional",
    author: "Redacción internacional",
    externalUrl: null,
    date: "07 abril 2026",
    featured: false,
    imageFit: "cover",
    imagePosition: "center center",
    imageHeight: 320
  }
];

function formatPublishedDate(value) {
  return value
    ? new Date(value).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "long",
        year: "numeric"
      })
    : "Fecha no disponible";
}

function normalizeGNewsArticles(articles = []) {
  return articles
    .filter((article) => article?.title)
    .map((article, index) => ({
      id: article.url || `external-${index}`,
      title: article.title || "Sin título",
      summary: article.description || "Sin resumen disponible.",
      content:
        article.content ||
        article.description ||
        "La fuente original no proporcionó un contenido extendido en esta consulta, pero puedes abrir la nota original para revisar más contexto.",
      image: article.image || DEFAULT_IMAGE,
      source: article.source?.name || "Fuente externa",
      author: article.source?.name || "Fuente externa",
      externalUrl: article.url || null,
      date: formatPublishedDate(article.publishedAt),
      publishedAt: article.publishedAt || "",
      featured: false,
      imageFit: "cover",
      imagePosition: "center center",
      imageHeight: 320
    }));
}

function uniqueByKey(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = ((item.externalUrl || "") + "|" + (item.title || "")).toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function fillWithFallback(realItems, fallbackItems, minCount = 10) {
  const merged = uniqueByKey([...(realItems || []), ...(fallbackItems || [])]);
  return merged.slice(0, Math.max(minCount, merged.length));
}

async function fetchTopHeadlines(lang, country, max = 10) {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  if (!apiKey || apiKey === "TU_API_KEY_AQUI") return [];

  const url = `https://gnews.io/api/v4/top-headlines?lang=${lang}&country=${country}&max=${max}&apikey=${apiKey}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Error al consultar GNews top-headlines");
  const data = await response.json();
  return normalizeGNewsArticles(data.articles || []);
}

async function fetchSearchQuery(query, lang, country, max = 10) {
  const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
  if (!apiKey || apiKey === "TU_API_KEY_AQUI") return [];

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=${lang}&country=${country}&max=${max}&sortby=publishedAt&apikey=${apiKey}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Error al consultar GNews search");
  const data = await response.json();
  return normalizeGNewsArticles(data.articles || []);
}

async function fetchCombinedQueries(queries, lang, country, maxPerQuery = 10) {
  const tasks = [
    fetchTopHeadlines(lang, country, maxPerQuery),
    ...queries.map((query) => fetchSearchQuery(query, lang, country, maxPerQuery))
  ];

  const results = await Promise.allSettled(tasks);
  const merged = results
    .filter((result) => result.status === "fulfilled" && Array.isArray(result.value))
    .flatMap((result) => result.value);

  const deduped = uniqueByKey(merged);
  return deduped.sort((a, b) => {
    const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    return bTime - aTime;
  });
}

function markFeatured(items) {
  return items.map((item, index) => ({ ...item, featured: index === 0 }));
}

export async function fetchMexicoNews() {
  const queries = [
    "mexico educacion escuelas estudiantes",
    "mexico tecnologia ciencia innovacion",
    "mexico cultura jovenes comunidad",
    "mexico actualidad"
  ];

  try {
    const real = await fetchCombinedQueries(queries, "es", "mx", 10);
    const filled = fillWithFallback(real, FALLBACK_MEXICO_NEWS, 10);
    return markFeatured(filled.slice(0, 10));
  } catch {
    return markFeatured(FALLBACK_MEXICO_NEWS);
  }
}

export async function fetchWorldNews() {
  const queries = [
    "world education students schools",
    "international science technology innovation",
    "global culture youth community",
    "world news"
  ];

  try {
    const real = await fetchCombinedQueries(queries, "en", "us", 10);
    const filled = fillWithFallback(real, FALLBACK_WORLD_NEWS, 10);
    return markFeatured(filled.slice(0, 10));
  } catch {
    return markFeatured(FALLBACK_WORLD_NEWS);
  }
}
