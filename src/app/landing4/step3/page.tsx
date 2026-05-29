"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FunnelLayout, ContinueButton } from "@/components/funnel/FunnelLayout";
import { SearchResultsMock } from "@/components/funnel/SearchResultsMock";

export default function LandingStep3() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!fullName.trim() || !email.trim()) return;
    setLoading(true);
    const sessionRes = await fetch("/api/funnel/session");
    const { session } = await sessionRes.json();
    const sessionId = session?.id;

    if (sessionId) {
      await fetch("/api/funnel/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, step: 3, fullName, email }),
      });
    }

    const searchRes = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        queryName: fullName,
        queryEmail: email,
        mode: "search",
        funnelSessionId: sessionId,
      }),
    });
    const { searchId } = await searchRes.json();
    router.push(`/landing4/step4?searchId=${searchId}&name=${encodeURIComponent(fullName)}`);
  }

  return (
    <FunnelLayout illustration={<SearchResultsMock />}>
      <h1 className="text-3xl font-bold">Make your first search!</h1>
      <p className="mt-4 text-gray-600">
        Discover social media profiles, photos, videos, and professional details
        instantly!
      </p>
      <label className="mt-8 block text-sm font-medium text-gray-700">
        The Person You&apos;re Looking For
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter full name to search..."
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </label>
      <label className="mt-4 block text-sm font-medium text-gray-700">
        Your email address to receive the report
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail address"
          className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3"
        />
      </label>
      <ContinueButton
        onClick={handleContinue}
        disabled={loading || !fullName.trim() || !email.includes("@")}
      />
    </FunnelLayout>
  );
}
