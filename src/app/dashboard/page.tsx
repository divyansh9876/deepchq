"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppNav } from "@/components/Logo";
import type { Brand } from "@/lib/types";

export default function DashboardPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    domain: "",
    competitors: "",
    country: "IN",
    keywords: "",
  });

  useEffect(() => {
    fetch("/api/brands")
      .then((r) => {
        if (r.status === 401) {
          router.push("/login");
          return null;
        }
        return r.json();
      })
      .then((d) => d && setBrands(d.brands ?? []));
  }, [router]);

  async function createBrand(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        domain: form.domain,
        competitors: form.competitors.split(",").map((s) => s.trim()).filter(Boolean),
        country: form.country,
        keywords: form.keywords.split(",").map((s) => s.trim()).filter(Boolean),
        autoPrompts: true,
      }),
    });
    setLoading(false);
    if (!res.ok) return;
    const { brand } = await res.json();
    router.push(`/brands/${brand.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Brand reports</h1>
            <p className="text-sm text-slate-500">Track AI search visibility per brand</p>
          </div>
          <button type="button" onClick={() => setShowForm(!showForm)} className="btn-primary">
            + New brand
          </button>
        </div>

        {showForm && (
          <form onSubmit={createBrand} className="card mt-6 grid gap-4 md:grid-cols-2">
            <input
              className="input"
              placeholder="Brand name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="input"
              placeholder="Domain (e.g. acme.com)"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              required
            />
            <input
              className="input md:col-span-2"
              placeholder="Competitors (comma-separated)"
              value={form.competitors}
              onChange={(e) => setForm({ ...form, competitors: e.target.value })}
            />
            <input
              className="input"
              placeholder="Keywords for prompt research (comma-separated)"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            />
            <input
              className="input"
              placeholder="Country code"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            <div className="md:col-span-2">
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? "Creating…" : "Create & add starter prompts"}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {brands.length === 0 && (
            <p className="text-slate-500">No brands yet. Create your first brand report.</p>
          )}
          {brands.map((b) => (
            <Link
              key={b.id}
              href={`/brands/${b.id}`}
              className="card transition hover:border-brand-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-slate-900">{b.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{b.domain}</p>
              {b.competitors.length > 0 && (
                <p className="mt-2 text-xs text-slate-400">
                  vs {b.competitors.join(", ")}
                </p>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
