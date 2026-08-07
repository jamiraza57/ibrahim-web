"use client";

import { useEffect, useState } from "react";
import { SectionConfigForm } from "@/features/homepage/components/SectionConfigForm";
import type { HomepageSectionType } from "@/features/homepage/schemas/homepage-section.schema";

interface Section {
  id: string;
  type: HomepageSectionType;
  order: number;
  isVisible: boolean;
  config: Record<string, unknown>;
}

const TYPE_OPTIONS: HomepageSectionType[] = [
  "HERO",
  "BANNER",
  "STATS",
  "BRAND_STORY",
  "SHOP_BY_CATEGORY",
  "FEATURED_COLLECTIONS",
  "FEATURED_PRODUCTS",
  "TESTIMONIALS",
  "NEWSLETTER",
  "INSTAGRAM",
];

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftConfig, setDraftConfig] = useState<Record<string, unknown>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [newType, setNewType] = useState<HomepageSectionType>("HERO");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/v1/admin/homepage-sections");
    const { data } = await res.json();
    setSections(data ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVisibility(section: Section) {
    await fetch(`/api/v1/admin/homepage-sections/${section.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...section, isVisible: !section.isVisible }),
    });
    await load();
  }

  async function moveSection(index: number, direction: -1 | 1) {
    const current = sections[index];
    const target = sections[index + direction];
    if (!current || !target) return;
    await fetch("/api/v1/admin/homepage-sections/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idA: current.id, idB: target.id }),
    });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this section from the homepage?")) return;
    await fetch(`/api/v1/admin/homepage-sections/${id}`, { method: "DELETE" });
    await load();
  }

  async function saveEdit(section: Section) {
    setError(null);
    const res = await fetch(`/api/v1/admin/homepage-sections/${section.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...section, config: draftConfig }),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Could not save section");
      return;
    }
    setEditingId(null);
    await load();
  }

  async function handleAdd() {
    setError(null);
    const res = await fetch("/api/v1/admin/homepage-sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: newType, order: sections.length, isVisible: true, config: draftConfig }),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error ?? "Could not add section");
      return;
    }
    setIsAdding(false);
    setDraftConfig({});
    await load();
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl text-foreground">Homepage Builder</h1>
        <button
          onClick={() => {
            setIsAdding((v) => !v);
            setDraftConfig({});
          }}
          className="rounded bg-gold px-4 py-2 text-sm font-medium text-gold-foreground"
        >
          {isAdding ? "Cancel" : "Add Section"}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}

      {isAdding && (
        <div className="mb-8 rounded border border-gold/20 bg-card p-4 sm:p-6">
          <select
            value={newType}
            onChange={(e) => {
              setNewType(e.target.value as HomepageSectionType);
              setDraftConfig({});
            }}
            className="mb-4 w-full rounded border border-gold/20 bg-background px-3 py-2 text-foreground sm:w-64"
          >
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t.replace(/_/g, " ")}
              </option>
            ))}
          </select>
          <SectionConfigForm type={newType} initialConfig={draftConfig} onChange={setDraftConfig} />
          <button onClick={handleAdd} className="mt-4 rounded bg-gold px-6 py-2 text-sm font-medium text-gold-foreground">
            Add to Homepage
          </button>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div key={section.id} className="rounded border border-gold/20 bg-card p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-display text-foreground">{section.type.replace(/_/g, " ")}</span>
                <span className={`ml-3 rounded-full px-2 py-0.5 text-xs ${section.isVisible ? "bg-gold/20 text-gold" : "bg-surface-2 text-secondary-text"}`}>
                  {section.isVisible ? "Visible" : "Hidden"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <button onClick={() => moveSection(index, -1)} disabled={index === 0} className="text-secondary-text hover:text-gold disabled:opacity-30">
                  ↑ Up
                </button>
                <button onClick={() => moveSection(index, 1)} disabled={index === sections.length - 1} className="text-secondary-text hover:text-gold disabled:opacity-30">
                  ↓ Down
                </button>
                <button onClick={() => toggleVisibility(section)} className="text-secondary-text hover:text-gold">
                  {section.isVisible ? "Hide" : "Show"}
                </button>
                <button
                  onClick={() => {
                    setEditingId(editingId === section.id ? null : section.id);
                    setDraftConfig(section.config);
                  }}
                  className="text-gold hover:underline"
                >
                  {editingId === section.id ? "Close" : "Edit"}
                </button>
                <button onClick={() => handleDelete(section.id)} className="text-destructive hover:underline">
                  Delete
                </button>
              </div>
            </div>

            {editingId === section.id && (
              <div className="mt-4 border-t border-gold/10 pt-4">
                <SectionConfigForm type={section.type} initialConfig={section.config} onChange={setDraftConfig} />
                <button onClick={() => saveEdit(section)} className="mt-4 rounded bg-gold px-6 py-2 text-sm font-medium text-gold-foreground">
                  Save Section
                </button>
              </div>
            )}
          </div>
        ))}
        {sections.length === 0 && !isAdding && (
          <p className="py-12 text-center text-secondary-text">No sections yet — add your first one above.</p>
        )}
      </div>
    </div>
  );
}
