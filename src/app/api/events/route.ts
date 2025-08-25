import { NextRequest } from "next/server";
import events, { type AppEvent } from "@/lib/events";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(_req: NextRequest) {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();
      // Helper to send an event
      const send = (data: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial hello to open stream
      send({ type: "connected", ts: Date.now() });

      // Relay app events
      const handler = (evt: AppEvent | any) => {
        try { send(evt); } catch {}
      };
      events.on("rate:created", handler);
      events.on("rate:updated", handler);
      events.on("rate:deleted", handler);

      // Heartbeat to keep connections alive on proxies
      const hb = setInterval(() => {
        try { controller.enqueue(encoder.encode(": hb\n\n")); } catch {}
      }, 30000);

      // Close handler
      const close = () => {
        clearInterval(hb);
        events.off("rate:created", handler);
        events.off("rate:updated", handler);
        events.off("rate:deleted", handler);
        try { controller.close(); } catch {}
      };

      // Abort when client disconnects
      // Note: Next.js does not expose request.signal here, but runtime will GC when connection closes.
      // We return a cancel function for safety via pull/cancel APIs if needed.

      // Expose cancel for GC
      (controller as any)._onClose = close;
    },
    cancel() {
      try { (this as any)._onClose?.(); } catch {}
    },
  });

  return new Response(stream as any, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
