import { getSearch, getSearchEvents } from "@/lib/search/store";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let lastSeq = 0;
      let closed = false;

      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const poll = async () => {
        if (closed) return;
        const search = await getSearch(id);
        if (!search) {
          send({ type: "error", payload: { error: "Not found" } });
          controller.close();
          return;
        }

        const events = await getSearchEvents(id);
        for (const e of events) {
          if (e.seq > lastSeq) {
            lastSeq = e.seq;
            send({
              type: e.type,
              seq: e.seq,
              payload: JSON.parse(e.payloadJson),
            });
          }
        }

        send({ type: "status", payload: { status: search.status } });

        if (search.status === "completed" || search.status === "failed") {
          send({ type: "done", payload: { status: search.status } });
          controller.close();
          closed = true;
          return;
        }

        setTimeout(poll, 500);
      };

      await poll();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
