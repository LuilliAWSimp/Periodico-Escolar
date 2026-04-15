import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ArticleEditorForm from "./ArticleEditorForm";
import SiteSettingsForm from "./SiteSettingsForm";
import { buildArticlePath } from "../utils/articleRoutes";

function SectionManager({ sectionKey, articles, onSave }) {
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
    const withoutTarget = replaceId
      ? articles.filter((article) => article.id !== replaceId)
      : [...articles];

    const normalizedArticles = nextArticle.featured
      ? withoutTarget.map((article) => ({ ...article, featured: false }))
      : withoutTarget;

    const result = [nextArticle, ...normalizedArticles];
    onSave(result);
    setEditingArticle(null);
    setIsCreating(false);
  };

  const handleDelete = (articleId) => {
    const result = articles.filter((article) => article.id !== articleId);
    onSave(result);
    if (editingArticle?.id === articleId) {
      setEditingArticle(null);
    }
  };

  return (
    <div className="manager-shell">
      <div className="manager-toolbar">
        <div>
          <p className="section-eyebrow">Gestión editorial</p>
          <h3>Escolar</h3>
          <p className="admin-note">La sección English reutiliza automáticamente estas mismas noticias.</p>
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
                <button
                  type="button"
                  className="danger-button"
                  onClick={() => handleDelete(article.id)}
                >
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
  onSaveSchoolArticles,
  siteSettings,
  onSaveSiteSettings
}) {
  return (
    <section className="admin-dashboard-shell">
      <div className="admin-dashboard-header">
        <div>
          <p className="section-eyebrow">Administrador</p>
          <h2>Panel del periódico escolar</h2>
          <p>
            Administra la identidad del periódico y las noticias de Escolar. English muestra exactamente las mismas noticias que Escolar para mantener una base más simple y estable.
          </p>
        </div>
      </div>

      <SiteSettingsForm
        siteSettings={siteSettings}
        onSave={onSaveSiteSettings}
      />

      <SectionManager
        sectionKey="escolar"
        articles={schoolArticles}
        onSave={onSaveSchoolArticles}
      />
    </section>
  );
}

export default AdminDashboard;
