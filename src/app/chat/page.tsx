"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppDisclaimer, AppShell } from "@/components/app/AppSidebar";
import { ChatSearchPanel } from "@/components/app/ChatSearchPanel";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/account").then((r) => {
      if (r.status === 401) {
        router.replace("/landing/login?next=/chat");
      }
    });
  }, [router]);

  return (
    <AppShell>
      <ChatSearchPanel />
      <AppDisclaimer />
    </AppShell>
  );
}
