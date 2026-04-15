import { supabase, isSupabaseConfigured } from "../lib/supabase";
import {
  loadLegacyManagedArticles,
  saveLegacyManagedArticles,
  loadLegacySiteSettings,
  saveLegacySiteSettings,
  DEFAULT_SITE_SETTINGS
} from "../utils/storage";

function mapArticleFromDb(row) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    content: row.content,
    image: row.image_url || "",
    category: row.category || "",
    author: row.author || "",
    date: row.display_date || "",
    featured: Boolean(row.featured),
    imageFit: row.image_fit || "cover",
    imagePosition: row.image_position || "center center",
    imageHeight: row.image_height || 320,
    externalUrl: row.external_url || null,
    mirroredFromSchoolId: row.mirrored_from_school_id || null,
    mirroredFromEnglishId: row.mirrored_from_english_id || null
  };
}

function mapArticleToDb(section, article) {
  return {
    id: article.id,
    section,
    title: article.title,
    summary: article.summary,
    content: article.content,
    image_url: article.image || "",
    category: article.category || "",
    author: article.author || "",
    display_date: article.date || "",
    featured: Boolean(article.featured),
    image_fit: article.imageFit || "cover",
    image_position: article.imagePosition || "center center",
    image_height: Number(article.imageHeight) || 320,
    external_url: article.externalUrl || null,
    mirrored_from_school_id: article.mirroredFromSchoolId || null,
    mirrored_from_english_id: article.mirroredFromEnglishId || null
  };
}

export async function fetchSectionArticles(section, fallbackArticles = []) {
  if (!isSupabaseConfigured) {
    return loadLegacyManagedArticles(section, fallbackArticles);
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("section", section)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return loadLegacyManagedArticles(section, fallbackArticles);
  }

  if (!data || !data.length) {
    if (fallbackArticles.length) {
      await saveSectionArticles(section, fallbackArticles);
      return fallbackArticles;
    }
    return [];
  }

  return data.map(mapArticleFromDb);
}

export async function saveSectionArticles(section, articles) {
  if (!isSupabaseConfigured) {
    saveLegacyManagedArticles(section, articles);
    return articles;
  }

  const { data: currentRows, error: readError } = await supabase
    .from("articles")
    .select("id")
    .eq("section", section);

  if (readError) throw readError;

  const currentIds = new Set((currentRows || []).map((row) => row.id));
  const nextIds = new Set(articles.map((article) => article.id));
  const idsToDelete = [...currentIds].filter((id) => !nextIds.has(id));

  if (idsToDelete.length) {
    const { error: deleteError } = await supabase
      .from("articles")
      .delete()
      .in("id", idsToDelete);

    if (deleteError) throw deleteError;
  }

  const payload = articles.map((article) => mapArticleToDb(section, article));

  if (payload.length) {
    const { error: upsertError } = await supabase
      .from("articles")
      .upsert(payload, { onConflict: "id" });

    if (upsertError) throw upsertError;
  }

  return articles;
}

export async function fetchSiteSettings() {
  if (!isSupabaseConfigured) {
    return loadLegacySiteSettings();
  }

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "main")
    .maybeSingle();

  if (error) {
    return loadLegacySiteSettings();
  }

  if (!data) {
    await saveSiteSettings(DEFAULT_SITE_SETTINGS);
    return DEFAULT_SITE_SETTINGS;
  }

  return {
    topMeta: data.top_meta || DEFAULT_SITE_SETTINGS.topMeta,
    kicker: data.kicker || DEFAULT_SITE_SETTINGS.kicker,
    title: data.title || DEFAULT_SITE_SETTINGS.title,
    subtitle: data.subtitle || DEFAULT_SITE_SETTINGS.subtitle
  };
}

export async function saveSiteSettings(settings) {
  if (!isSupabaseConfigured) {
    saveLegacySiteSettings(settings);
    return settings;
  }

  const payload = {
    id: "main",
    top_meta: settings.topMeta,
    kicker: settings.kicker,
    title: settings.title,
    subtitle: settings.subtitle
  };

  const { error } = await supabase
    .from("site_settings")
    .upsert(payload, { onConflict: "id" });

  if (error) throw error;

  return settings;
}

export async function uploadImageToStorage(file, sectionKey) {
  if (!isSupabaseConfigured) {
    throw new Error("Supabase no está configurado.");
  }

  const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET;
  if (!bucket) {
    throw new Error("Falta VITE_SUPABASE_STORAGE_BUCKET.");
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `${sectionKey}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "image/jpeg"
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}