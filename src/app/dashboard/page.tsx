import { redirect } from "next/navigation";

/** Legacy URL — main search UI lives at /chat */
export default function DashboardPage() {
  redirect("/chat");
}
