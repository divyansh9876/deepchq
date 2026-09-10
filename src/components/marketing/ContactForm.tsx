"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export function ContactForm() {
  const params = useSearchParams();
  const defaultPlan = useMemo(() => params.get("plan") ?? "", [params]);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    plan: defaultPlan,
    message: defaultPlan === "agency" ? "Interested in the Agency plan for our clients." : "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-900">Message received</h2>
        <p className="mt-2 text-sm text-slate-600">
          Thanks {form.name}. We typically reply within one business day at the email you provided.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input"
          type="email"
          placeholder="Work email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <input
          className="input"
          placeholder="Company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
        <select
          className="input"
          value={form.plan}
          onChange={(e) => setForm({ ...form, plan: e.target.value })}
        >
          <option value="">How can we help?</option>
          <option value="growth">Growth plan</option>
          <option value="agency">Agency plan</option>
          <option value="demo">Product demo</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <textarea
        className="input min-h-32"
        placeholder="Tell us about your brands and what you want to measure"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
      />
      <button type="submit" className="btn-primary">
        Send message
      </button>
    </form>
  );
}
