import { createServerFileRoute } from "@tanstack/react-start/server";

import { getWebSocket } from "~/utils/durable";

export const ServerRoute = createServerFileRoute("/api/durable").methods({
  GET: () => {
    return getWebSocket("my_object_name");
  },
});
