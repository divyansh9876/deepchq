import { getMarkdownArtifact } from "@/lib/search/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const artifact = await getMarkdownArtifact(id);
  if (!artifact) {
    return new Response("Not found", { status: 404 });
  }
  return new Response(artifact.body, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": `attachment; filename="deepchq-${id}.md"`,
    },
  });
}
