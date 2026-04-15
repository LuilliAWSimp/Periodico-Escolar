import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ArticleEditorForm from "./ArticleEditorForm";
import SiteSettingsForm from "./SiteSettingsForm";
import { buildArticlePath } from "../utils/articleRoutes";

function SectionManager({
  sectionKey,
  title,
  note,
  articles,
  onSave,
  onCreateMirror
}) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [articles]);

  const handleSubmit = (nextArticle, { replaceId }) => {
    const isNewArticle = !replaceId;

    const withoutTarget = replaceId
      ? articles.filter((article) => article.id !== replaceId)
      : [...articles];

    const normalizedArticles = nextArticle.featured
      ? withoutTarget.map((article) => ({ ...article, featured: false }))
      : withoutTarget;

    const result = [nextArticle, ...normalizedArticles];
    onSave(result);

    if (sectionKey === "escolar" && isNewArticle && onCreateMirror) {
      onCreateMirror(nextArticle);
    }

    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleDelete = (articleId) => {
    const result = articles.filter((article) => article.id !== articleId);
    onSave(result);
    if (editingArticle?.id === articleId) setEditingArticle(null);
  };

  return (
    <div className="manager-shell">
      <div className="manager-toolbar">
        <div>
          <p className="section-eyebrow">Gestión editorial</p>
          <h3>{title}</h3>
          <p className="admin-note">{note}</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => {
            setEditingArticle(null);
            setIsCreating(true);
          }}
        >
          Nueva noticia
        </button>
      </div>

      {isCreating || editingArticle ? (
        <ArticleEditorForm
          sectionKey={sectionKey}
          article={editingArticle}
          onCancel={() => {
            setIsCreating(false);
            setEditingArticle(null);
          }}
          onSubmit={handleSubmit}
        />
      ) : null}

      <div className="admin-list-grid">
        {sortedArticles.map((article) => (
          <article key={article.id} className="admin-article-card">
            <img src={article.image} alt={article.title} className="admin-article-image" />
            <div className="admin-article-body">
              <p className="article-meta">
                <span>{article.category}</span>
                <span>•</span>
                <span>{article.date}</span>
              </p>
              <h4>{article.title}</h4>
              <p>{article.summary}</p>
              {article.featured ? <span className="featured-badge">Principal</span> : null}
              <div className="admin-card-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setEditingArticle(article);
                    setIsCreating(false);
                  }}
                >
                  Editar
                </button>
                <button type="button" className="danger-button" onClick={() => handleDelete(article.id)}>
                  Eliminar
                </button>
                <Link to={buildArticlePath(sectionKey, article.id)} className="card-link subtle">
                  Ver detalle
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard({
  schoolArticles,
  englishArticles,
  onSaveSchoolArticles,
  onSaveEnglishArticles,
  onCreateEnglishMirror,
  siteSettings,
  onSaveSiteSettings
}) {
  const [activeSection, setActiveSection] = useState("escolar");

  return (
    <section className="admin-dashboard-shell">
      <div className="admin-dashboard-header">
        <div>
          <p className="section-eyebrow">Administrador</p>
          <h2>Panel del periódico escolar</h2>
          <p>
            Administra la identidad del periódico y edita por separado las noticias visibles de Escolar y English.
          </p>
        </div>
      </div>

      <SiteSettingsForm siteSettings={siteSettings} onSave={onSaveSiteSettings} />

      <div className="admin-section-switcher">
        <button
          type="button"
          className={`section-switch-button ${activeSection === "escolar" ? "active" : ""}`}
          onClick={() => setActiveSection("escolar")}
        >
          Editar Escolar
        </button>
        <button
          type="button"
          className={`section-switch-button ${activeSection === "english" ? "active" : ""}`}
          onClick={() => setActiveSection("english")}
        >
          Editar English
        </button>
      </div>

      {activeSection === "escolar" ? (
        <SectionManager
          sectionKey="escolar"
          title="Escolar"
          note="Crear una noticia aquí también genera automáticamente una copia inicial en English."
          articles={schoolArticles}
          onSave={onSaveSchoolArticles}
          onCreateMirror={onCreateEnglishMirror}
        />
      ) : (
        <SectionManager
          sectionKey="english"
          title="English"
          note="Esta pestaña controla directamente el contenido visible de la sección English."
          articles={englishArticles}
          onSave={onSaveEnglishArticles}
        />
      )}
    </section>
  );
}

export default AdminDashboard;