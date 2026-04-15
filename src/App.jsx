import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import Header from "./components/Header";
import TopNav from "./components/TopNav";
import SectionHero from "./components/SectionHero";
import FeaturedArticle from "./components/FeaturedArticle";
import ArticleCard from "./components/ArticleCard";
import ArticleDetail from "./components/ArticleDetail";
import Footer from "./components/Footer";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import schoolNewsSeed from "./data/schoolNews";
import schoolNewsEnglishSeed from "./data/schoolNewsEnglish";
import { fetchMexicoNews, fetchWorldNews } from "./services/newsApi";
import {
  clearAdminSession,
  getAdminSession,
  loadManagedArticles,
  saveManagedArticles,
  loadSiteSettings,
  saveSiteSettings
} from "./utils/storage";

const SECTION_CONFIG = {
  escolar: {
    label: "Escolar",
    description: "Noticias, actividades y eventos de nuestra comunidad escolar.",
    isExternal: false
  },
  english: {
    label: "English",
    description: "Edición editable en inglés con su propio contenido administrable desde el panel.",
    isExternal: false
  },
  mexico: {
    label: "México",
    description: "Actualidad nacional conectada a una fuente real de noticias con fallback local.",
    isExternal: true
  },
  internacional: {
    label: "Internacional",
    description: "Panorama global conectado a una fuente real de noticias con fallback local.",
    isExternal: true
  }
};

function Layout({ children, isAdminAuthenticated, onLogout, siteSettings }) {
  return (
    <div className="app-shell">
      <Header
        isAdminAuthenticated={isAdminAuthenticated}
        onLogout={onLogout}
        siteSettings={siteSettings}
      />
      <TopNav sections={SECTION_CONFIG} />
      <main className="page">{children}</main>
      <Footer />
    </div>
  );
}

function SectionPage({
  sectionKey,
  articles,
  loading,
  error,
  isAdminAuthenticated,
  onLogout,
  siteSettings
}) {
  const config = SECTION_CONFIG[sectionKey];
  const featuredArticle = articles.find((article) => article.featured) || articles[0];
  const secondaryArticles = articles
    .filter((article) => article.id !== featuredArticle?.id)
    .slice(0, 9);

  return (
    <Layout
      isAdminAuthenticated={isAdminAuthenticated}
      onLogout={onLogout}
      siteSettings={siteSettings}
    >
      <SectionHero
        title={config.label}
        description={config.description}
        isExternal={config.isExternal}
      />

      {loading ? (
        <section className="status-panel">
          <p>Cargando noticias...</p>
        </section>
      ) : error ? (
        <section className="status-panel error">
          <p>{error}</p>
        </section>
      ) : !featuredArticle ? (
        <section className="status-panel">
          <p>No hay noticias disponibles en esta sección.</p>
        </section>
      ) : (
        <>
          <section className="lead-layout">
            <FeaturedArticle article={featuredArticle} sectionKey={sectionKey} />
            <aside className="side-stack">
              {secondaryArticles.slice(0, 3).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  sectionKey={sectionKey}
                  compact
                />
              ))}
            </aside>
          </section>

          <section className="news-grid-section">
            <div className="section-divider">
              <span>Más titulares</span>
            </div>

            <div className="news-grid">
              {secondaryArticles.slice(3).map((article) => (
                <ArticleCard key={article.id} article={article} sectionKey={sectionKey} />
              ))}
            </div>
          </section>
        </>
      )}
    </Layout>
  );
}

function DetailPage({
  getSectionArticles,
  externalState,
  isAdminAuthenticated,
  onLogout,
  siteSettings
}) {
  const { sectionKey, articleId } = useParams();
  const decodedId = decodeURIComponent(articleId || "");

  if (!SECTION_CONFIG[sectionKey]) {
    return <Navigate to="/escolar" replace />;
  }

  const loading = externalState.loading[sectionKey] || false;
  const error = externalState.error[sectionKey] || "";
  const articles = getSectionArticles(sectionKey);
  const article = articles.find((item) => item.id === decodedId);

  return (
    <Layout
      isAdminAuthenticated={isAdminAuthenticated}
      onLogout={onLogout}
      siteSettings={siteSettings}
    >
      {loading ? (
        <section className="status-panel">
          <p>Cargando detalle de noticia...</p>
        </section>
      ) : error ? (
        <section className="status-panel error">
          <p>{error}</p>
        </section>
      ) : !article ? (
        <section className="status-panel error">
          <p>No se encontró la noticia solicitada.</p>
        </section>
      ) : (
        <ArticleDetail
          article={article}
          sectionLabel={SECTION_CONFIG[sectionKey].label}
          backTo={`/${sectionKey}`}
        />
      )}
    </Layout>
  );
}

function AdminLoginPage({ onLogin, isAdminAuthenticated, onLogout, siteSettings }) {
  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Layout
      isAdminAuthenticated={isAdminAuthenticated}
      onLogout={onLogout}
      siteSettings={siteSettings}
    >
      <AdminLogin onLogin={onLogin} />
    </Layout>
  );
}

function ProtectedAdminRoute({ isAdminAuthenticated, children }) {
  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

function AdminPage({
  isAdminAuthenticated,
  onLogout,
  schoolArticles,
  englishArticles,
  onSaveSchoolArticles,
  onSaveEnglishArticles,
  onCreateEnglishMirror,
  onCreateSchoolMirror,
  siteSettings,
  onSaveSiteSettings
}) {
  return (
    <ProtectedAdminRoute isAdminAuthenticated={isAdminAuthenticated}>
      <Layout
        isAdminAuthenticated={isAdminAuthenticated}
        onLogout={onLogout}
        siteSettings={siteSettings}
      >
        <AdminDashboard
          schoolArticles={schoolArticles}
          englishArticles={englishArticles}
          onSaveSchoolArticles={onSaveSchoolArticles}
          onSaveEnglishArticles={onSaveEnglishArticles}
          onCreateEnglishMirror={onCreateEnglishMirror}
          onCreateSchoolMirror={onCreateSchoolMirror}
          siteSettings={siteSettings}
          onSaveSiteSettings={onSaveSiteSettings}
        />
      </Layout>
    </ProtectedAdminRoute>
  );
}

function HomeRedirect() {
  const location = useLocation();
  if (location.pathname === "/") {
    return <Navigate to="/escolar" replace />;
  }
  return null;
}

function App() {
  const [schoolArticles, setSchoolArticles] = useState(() =>
    loadManagedArticles("escolar", schoolNewsSeed)
  );
  const [englishArticles, setEnglishArticles] = useState(() =>
    loadManagedArticles("english", schoolNewsEnglishSeed)
  );
  const [siteSettings, setSiteSettings] = useState(() => loadSiteSettings());
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => getAdminSession());
  const [externalNews, setExternalNews] = useState({ mexico: [], internacional: [] });
  const [loading, setLoading] = useState({ mexico: false, internacional: false });
  const [error, setError] = useState({ mexico: "", internacional: "" });

  useEffect(() => {
    let isMounted = true;

    async function loadExternalNews() {
      setLoading({ mexico: true, internacional: true });

      const [mxNews, worldNews] = await Promise.all([
        fetchMexicoNews(),
        fetchWorldNews()
      ]);

      if (!isMounted) return;

      setExternalNews({
        mexico: mxNews,
        internacional: worldNews
      });
      setLoading({ mexico: false, internacional: false });
      setError({ mexico: "", internacional: "" });
    }

    loadExternalNews().catch(() => {
      if (!isMounted) return;
      setLoading({ mexico: false, internacional: false });
      setError({
        mexico: "No se pudieron cargar las noticias de México.",
        internacional: "No se pudieron cargar las noticias internacionales."
      });
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSaveSchoolArticles = (articles) => {
    setSchoolArticles(articles);
    saveManagedArticles("escolar", articles);
  };

  const handleSaveEnglishArticles = (articles) => {
    setEnglishArticles(articles);
    saveManagedArticles("english", articles);
  };

  const handleCreateEnglishMirror = (schoolArticle) => {
    setEnglishArticles((current) => {
      const alreadyExists = current.some(
        (article) => article.mirroredFromSchoolId === schoolArticle.id
      );

      if (alreadyExists) {
        return current;
      }

      const mirroredArticle = {
        ...schoolArticle,
        id: `english-${schoolArticle.id}`,
        mirroredFromSchoolId: schoolArticle.id,
        category: "English",
        author: "English Editorial Desk"
      };

      const nextArticles = mirroredArticle.featured
        ? [mirroredArticle, ...current.map((article) => ({ ...article, featured: false }))]
        : [mirroredArticle, ...current];

      saveManagedArticles("english", nextArticles);
      return nextArticles;
    });
  };

  const handleCreateSchoolMirror = (englishArticle) => {
    setSchoolArticles((current) => {
      const alreadyExists = current.some(
        (article) => article.mirroredFromEnglishId === englishArticle.id
      );

      if (alreadyExists) {
        return current;
      }

      const mirroredArticle = {
        ...englishArticle,
        id: `school-${englishArticle.id}`,
        mirroredFromEnglishId: englishArticle.id,
        category: "Escolar",
        author: "Redacción Escolar"
      };

      const nextArticles = mirroredArticle.featured
        ? [mirroredArticle, ...current.map((article) => ({ ...article, featured: false }))]
        : [mirroredArticle, ...current];

      saveManagedArticles("escolar", nextArticles);
      return nextArticles;
    });
  };

  const handleSaveSiteSettings = (nextSettings) => {
    setSiteSettings(nextSettings);
    saveSiteSettings(nextSettings);
  };

  const handleLogin = () => setIsAdminAuthenticated(true);

  const handleLogout = () => {
    clearAdminSession();
    setIsAdminAuthenticated(false);
  };

  const sectionArticles = useMemo(
    () => ({
      escolar: schoolArticles,
      english: englishArticles,
      mexico: externalNews.mexico,
      internacional: externalNews.internacional
    }),
    [schoolArticles, englishArticles, externalNews]
  );

  const getSectionArticles = (sectionKey) => sectionArticles[sectionKey] || [];

  return (
    <>
      <HomeRedirect />
      <Routes>
        <Route
          path="/escolar"
          element={
            <SectionPage
              sectionKey="escolar"
              articles={getSectionArticles("escolar")}
              loading={false}
              error=""
              isAdminAuthenticated={isAdminAuthenticated}
              onLogout={handleLogout}
              siteSettings={siteSettings}
            />
          }
        />
        <Route
          path="/english"
          element={
            <SectionPage
              sectionKey="english"
              articles={getSectionArticles("english")}
              loading={false}
              error=""
              isAdminAuthenticated={isAdminAuthenticated}
              onLogout={handleLogout}
              siteSettings={siteSettings}
            />
          }
        />
        <Route
          path="/mexico"
          element={
            <SectionPage
              sectionKey="mexico"
              articles={getSectionArticles("mexico")}
              loading={loading.mexico}
              error={error.mexico}
              isAdminAuthenticated={isAdminAuthenticated}
              onLogout={handleLogout}
              siteSettings={siteSettings}
            />
          }
        />
        <Route
          path="/internacional"
          element={
            <SectionPage
              sectionKey="internacional"
              articles={getSectionArticles("internacional")}
              loading={loading.internacional}
              error={error.internacional}
              isAdminAuthenticated={isAdminAuthenticated}
              onLogout={handleLogout}
              siteSettings={siteSettings}
            />
          }
        />
        <Route
          path="/noticia/:sectionKey/:articleId"
          element={
            <DetailPage
              getSectionArticles={getSectionArticles}
              externalState={{ loading, error }}
              isAdminAuthenticated={isAdminAuthenticated}
              onLogout={handleLogout}
              siteSettings={siteSettings}
            />
          }
        />
        <Route
          path="/admin/login"
          element={
            <AdminLoginPage
              onLogin={handleLogin}
              isAdminAuthenticated={isAdminAuthenticated}
              onLogout={handleLogout}
              siteSettings={siteSettings}
            />
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPage
              isAdminAuthenticated={isAdminAuthenticated}
              onLogout={handleLogout}
              schoolArticles={schoolArticles}
              englishArticles={englishArticles}
              onSaveSchoolArticles={handleSaveSchoolArticles}
              onSaveEnglishArticles={handleSaveEnglishArticles}
              onCreateEnglishMirror={handleCreateEnglishMirror}
              onCreateSchoolMirror={handleCreateSchoolMirror}
              siteSettings={siteSettings}
              onSaveSiteSettings={handleSaveSiteSettings}
            />
          }
        />
        <Route path="*" element={<Navigate to="/escolar" replace />} />
      </Routes>
    </>
  );
}

export default App;