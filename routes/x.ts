import { define } from "../utils.ts";

export const handler = define.handlers({
  GET() {
    return new Response("Moved Permanently", {
      status: 301,
      headers: {
        Location: "https://x.com/@suyo_haru",
      },
    });
  }
});