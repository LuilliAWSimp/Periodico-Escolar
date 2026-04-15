const STORAGE_KEYS = {
  escolar: "periodico_escolar_articles",
  english: "periodico_english_articles",
  adminSession: "periodico_admin_session",
  siteSettings: "periodico_site_settings"
};

export const DEFAULT_SITE_SETTINGS = {
  topMeta: "Edición digital escolar",
  kicker: "Comunidad • Escuela • Cultura • Actualidad",
  title: "El Faro Escolar",
  subtitle: "Un periódico escolar digital con mirada local, nacional e internacional"
};

export function loadLegacyManagedArticles(sectionKey, fallbackArticles) {
  if (typeof window === "undefined") return fallbackArticles;
  const storageKey = STORAGE_KEYS[sectionKey];
  if (!storageKey) return fallbackArticles;

  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return fallbackArticles;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export function saveLegacyManagedArticles(sectionKey, articles) {
  if (typeof window === "undefined") return;
  const storageKey = STORAGE_KEYS[sectionKey];
  if (!storageKey) return;
  window.localStorage.setItem(storageKey, JSON.stringify(articles));
}

export function loadLegacySiteSettings() {
  if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.siteSettings);
    if (!stored) return DEFAULT_SITE_SETTINGS;
    return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveLegacySiteSettings(settings) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEYS.siteSettings,
    JSON.stringify({ ...DEFAULT_SITE_SETTINGS, ...settings })
  );
}

export function getAdminSession() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(STORAGE_KEYS.adminSession) === "true";
}

export function createAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEYS.adminSession, "true");
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEYS.adminSession);
}

export function authenticateAdmin(username, password) {
  const validUser = import.meta.env.VITE_ADMIN_USER || "admin";
  const validPassword = import.meta.env.VITE_ADMIN_PASSWORD || "editor2026";
  return username === validUser && password === validPassword;
}

export function createArticleId(sectionKey) {
  return `${sectionKey}-${Date.now()}`;
}

export function getTodayDisplayDate(sectionKey) {
  if (sectionKey === "english") {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date());
  }

  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());
}