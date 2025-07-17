import { DurableObject } from "cloudflare:workers";

import { getBindings } from "~/utils/bindings";

const env = getBindings() as unknown as {
  MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
};

export async function getWebSocket(name: string) {
  const id = env.MY_DURABLE_OBJECT.idFromName(name);
  const stub = env.MY_DURABLE_OBJECT.get(id);
  return stub.getWebSocket();
}

export class MyDurableObject extends DurableObject {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async getWebSocket(): Promise<Response> {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    this.ctx.acceptWebSocket(server);
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
    switch (message) {
      case "refresh":
        ws.send("{}");
        break;
      default:
    }
  }

  async webSocketClose(
    ws: WebSocket,
    code: number,
    reason: string,
    _wasClean: boolean
  ) {
    ws.close(code, reason);
  }
}
