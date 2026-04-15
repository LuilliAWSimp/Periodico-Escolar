import { useEffect, useMemo, useState } from "react";

const DEFAULT_SITE_SETTINGS = {
  topMeta: "Edición digital escolar",
  kicker: "Comunidad • Escuela • Cultura • Actualidad",
  title: "El Faro Escolar",
  subtitle: "Un periódico escolar digital con mirada local, nacional e internacional"
};

function SiteSettingsForm({ siteSettings, onSave }) {
  const safeSettings = useMemo(
    () => ({ ...DEFAULT_SITE_SETTINGS, ...(siteSettings || {}) }),
    [siteSettings]
  );

  const [form, setForm] = useState(safeSettings);

  useEffect(() => {
    setForm(safeSettings);
  }, [safeSettings]);

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      ...DEFAULT_SITE_SETTINGS,
      ...form
    });
  };

  return (
    <form className="editor-form-card" onSubmit={handleSubmit}>
      <div className="editor-form-header">
        <h3>Identidad del periódico</h3>
        <p>
          Cambia el nombre principal del periódico, el subtítulo y el texto superior sin editar código manualmente.
        </p>
      </div>

      <div className="editor-form-grid">
        <label className="editor-form-full">
          Texto superior
          <input
            type="text"
            value={form.topMeta}
            onChange={(event) => handleChange("topMeta", event.target.value)}
            required
          />
        </label>

        <label className="editor-form-full">
          Franja editorial superior
          <input
            type="text"
            value={form.kicker}
            onChange={(event) => handleChange("kicker", event.target.value)}
            required
          />
        </label>

        <label className="editor-form-full">
          Nombre del periódico
          <input
            type="text"
            value={form.title}
            onChange={(event) => handleChange("title", event.target.value)}
            required
          />
        </label>

        <label className="editor-form-full">
          Subtítulo
          <textarea
            rows="2"
            value={form.subtitle}
            onChange={(event) => handleChange("subtitle", event.target.value)}
            required
          />
        </label>
      </div>

      <div className="editor-form-actions">
        <button type="submit" className="primary-button">
          Guardar identidad del periódico
        </button>
      </div>
    </form>
  );
}

export default SiteSettingsForm;
