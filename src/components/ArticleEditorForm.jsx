import { useEffect, useState } from "react";
import { createArticleId, getTodayDisplayDate } from "../utils/storage";

const EMPTY_FORM = {
  title: "",
  summary: "",
  content: "",
  image: "",
  category: "",
  author: "",
  date: "",
  featured: false,
  imageFit: "cover",
  imagePosition: "center center",
  imageHeight: 320
};

function PreviewMockArticle({ form, imagePreview }) {
  const previewArticle = {
    title: form.title || "Vista previa del titular",
    summary: form.summary || "Aquí verás un resumen similar al resultado publicado.",
    image:
      imagePreview ||
      "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
    imageFit: form.imageFit,
    imagePosition: form.imagePosition,
    imageHeight: Number(form.imageHeight) || 320,
    category: form.category || "Categoría",
    author: form.author || "Autor",
    date: form.date || "Fecha"
  };

  return (
    <div className="editor-preview-shell">
      <p className="section-eyebrow">Vista previa editorial</p>
      <article className="editor-preview-card">
        <div className="editor-preview-image-wrap" style={{ height: `${previewArticle.imageHeight}px` }}>
          <img
            src={previewArticle.image}
            alt={previewArticle.title}
            className="editor-preview-image"
            style={{ objectFit: previewArticle.imageFit, objectPosition: previewArticle.imagePosition }}
          />
        </div>

        <div className="editor-preview-body">
          <p className="article-meta">
            <span>{previewArticle.category}</span>
            <span>•</span>
            <span>{previewArticle.date}</span>
          </p>
          <h4>{previewArticle.title}</h4>
          <p>{previewArticle.summary}</p>
          <span className="preview-author">{previewArticle.author}</span>
        </div>
      </article>
    </div>
  );
}

function ArticleEditorForm({ sectionKey, article, onCancel, onSubmit, onUploadImage }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageMode, setImageMode] = useState("url");
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [pendingFile, setPendingFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (article) {
      const currentImage = article.image || "";
      const localImage = currentImage.startsWith("data:image/");
      setForm({
        title: article.title || "",
        summary: article.summary || "",
        content: article.content || "",
        image: currentImage,
        category: article.category || "",
        author: article.author || "",
        date: article.date || "",
        featured: Boolean(article.featured),
        imageFit: article.imageFit || "cover",
        imagePosition: article.imagePosition || "center center",
        imageHeight: article.imageHeight || 320,
        mirroredFromSchoolId: article.mirroredFromSchoolId || null,
        mirroredFromEnglishId: article.mirroredFromEnglishId || null
      });
      setImageMode(localImage ? "upload" : "url");
      setImagePreview(currentImage);
      setPendingFile(null);
      setImageError("");
      return;
    }

    setForm({
      ...EMPTY_FORM,
      category: sectionKey === "english" ? "English" : "Escolar",
      author: sectionKey === "english" ? "English Editorial Desk" : "Redacción Escolar",
      date: getTodayDisplayDate(sectionKey)
    });
    setImageMode("url");
    setImagePreview("");
    setPendingFile(null);
    setImageError("");
  }, [article, sectionKey]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    if (field === "image" && imageMode === "url") setImagePreview(value);
  };

  const handleImageModeChange = (mode) => {
    setImageMode(mode);
    setImageError("");

    if (mode === "url") {
      setPendingFile(null);
      setImagePreview(form.image.startsWith("data:image/") ? "" : form.image);
      return;
    }

    if (form.image.startsWith("data:image/")) {
      setImagePreview(form.image);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("Selecciona un archivo de imagen válido.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setPendingFile(file);
      setForm((current) => ({ ...current, image: result }));
      setImagePreview(result);
      setImageError("");
    };
    reader.onerror = () => setImageError("No se pudo cargar la imagen seleccionada.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.image.trim()) {
      setImageError("Agrega una imagen por URL o sube una desde tu dispositivo.");
      return;
    }

    setIsSaving(true);
    try {
      let finalImage = form.image;

      if (imageMode === "upload" && pendingFile && onUploadImage) {
        finalImage = await onUploadImage(pendingFile, sectionKey);
      }

      const nextArticle = {
        id: article?.id || createArticleId(sectionKey),
        title: form.title.trim(),
        summary: form.summary.trim(),
        content: form.content.trim(),
        image: finalImage,
        category: form.category.trim(),
        author: form.author.trim(),
        date: form.date.trim(),
        featured: Boolean(form.featured),
        imageFit: form.imageFit || "cover",
        imagePosition: form.imagePosition || "center center",
        imageHeight: Number(form.imageHeight) || 320,
        externalUrl: null,
        mirroredFromSchoolId: form.mirroredFromSchoolId || null,
        mirroredFromEnglishId: form.mirroredFromEnglishId || null
      };

      await onSubmit(nextArticle, { replaceId: article?.id || null });
    } catch (error) {
      setImageError(error.message || "No se pudo guardar la noticia.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="editor-form-card" onSubmit={handleSubmit}>
      <div className="editor-form-header">
        <h3>{article ? "Editar noticia" : "Nueva noticia"}</h3>
        <p>{sectionKey === "english" ? "Edita directamente el contenido visible de la sección English." : "Gestiona las noticias de la sección Escolar sin romper la portada actual."}</p>
      </div>

      <div className="editor-form-grid">
        <label>
          Título
          <input type="text" value={form.title} onChange={(event) => handleChange("title", event.target.value)} required />
        </label>

        <label>
          Categoría
          <input type="text" value={form.category} onChange={(event) => handleChange("category", event.target.value)} required />
        </label>

        <label>
          Autor
          <input type="text" value={form.author} onChange={(event) => handleChange("author", event.target.value)} required />
        </label>

        <label>
          Fecha visible
          <input type="text" value={form.date} onChange={(event) => handleChange("date", event.target.value)} required />
        </label>

        <div className="editor-form-full image-mode-block">
          <span className="input-label">Imagen de la noticia</span>

          <div className="image-mode-switcher">
            <button type="button" className={`section-switch-button ${imageMode === "url" ? "active" : ""}`} onClick={() => handleImageModeChange("url")}>URL</button>
            <button type="button" className={`section-switch-button ${imageMode === "upload" ? "active" : ""}`} onClick={() => handleImageModeChange("upload")}>Subir archivo</button>
          </div>

          {imageMode === "url" ? (
            <label className="image-field-label">
              Imagen URL
              <input type="url" value={form.image.startsWith("data:image/") ? "" : form.image} onChange={(event) => handleChange("image", event.target.value)} placeholder="https://..." />
            </label>
          ) : (
            <label className="image-field-label">
              Subir imagen desde dispositivo
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
          )}

          <div className="image-controls-grid">
            <label>
              Ajuste de imagen
              <select value={form.imageFit} onChange={(event) => handleChange("imageFit", event.target.value)}>
                <option value="cover">Cover</option>
                <option value="contain">Contain</option>
              </select>
            </label>

            <label>
              Enfoque / posición
              <select value={form.imagePosition} onChange={(event) => handleChange("imagePosition", event.target.value)}>
                <option value="center center">Centro</option>
                <option value="top center">Arriba</option>
                <option value="bottom center">Abajo</option>
                <option value="center left">Izquierda</option>
                <option value="center right">Derecha</option>
                <option value="top left">Arriba izquierda</option>
                <option value="top right">Arriba derecha</option>
                <option value="bottom left">Abajo izquierda</option>
                <option value="bottom right">Abajo derecha</option>
              </select>
            </label>

            <label>
              Alto del bloque de imagen
              <input type="range" min="180" max="520" step="10" value={form.imageHeight} onChange={(event) => handleChange("imageHeight", Number(event.target.value))} />
              <span className="range-value">{form.imageHeight}px</span>
            </label>
          </div>

          {imageError ? <p className="form-error">{imageError}</p> : null}
        </div>

        <div className="editor-form-full">
          <PreviewMockArticle form={form} imagePreview={imagePreview || form.image} />
        </div>

        <label className="editor-form-full">
          Resumen
          <textarea rows="3" value={form.summary} onChange={(event) => handleChange("summary", event.target.value)} required />
        </label>

        <label className="editor-form-full">
          Contenido completo
          <textarea rows="8" value={form.content} onChange={(event) => handleChange("content", event.target.value)} required />
        </label>
      </div>

      <label className="checkbox-row">
        <input type="checkbox" checked={form.featured} onChange={(event) => handleChange("featured", event.target.checked)} />
        Marcar como noticia principal de la sección
      </label>

      <div className="editor-form-actions">
        <button type="submit" className="primary-button" disabled={isSaving}>{isSaving ? "Guardando..." : article ? "Guardar cambios" : "Crear noticia"}</button>
        <button type="button" className="secondary-button" onClick={onCancel} disabled={isSaving}>Cancelar</button>
      </div>
    </form>
  );
}

export default ArticleEditorForm; 