import * as http from "http";

export interface IRoute { method: string; path: string; handler: (ctx: ICtx<any>) => void; }

export interface ICtx<T> {
    req: IReqCtx<T>;
    res: http.ServerResponse;
}

export interface IReqCtx<T> {
    body: Buffer[];
    param: T;
}

export function createHttpServer(...router: IRoute[]) {
    const server = http.createServer(
        (request: http.IncomingMessage, response: http.ServerResponse) => {
            const route: IRoute = router.filter(routeMatch(request.method as string, request.url as string))[0];
            const ctx: ICtx<any> = { res: response } as ICtx<any>;
            console.info(Object.keys(ctx), 99999);
            ctx.res.setHeader("Content-Type", "application/json");
            if (route) {
                const body: Buffer[] = [];
                request.on("data", (chunk: Buffer) => {
                    body.push(chunk);
                    ctx.req.body = body;
                    ctx.req.param = { id: 1 };
                });
                request.on("end", () => route.handler(ctx));
            } else {
                response.writeHead(500);
                response.end("route not match.");
            }
        });
    server.on("clientError", (err, socket) => {
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
    return server;
}

export const routeMatch = (reqMethod: string, reqUrl: string) => (route: IRoute) => {
    if (reqMethod === route.method) {
        const routePath = route.path.split("/").slice(1);
        const reqPaths = reqUrl.split("/").slice(1);
        const matchNumber = routePath.filter((path, idx) => !path.startsWith(":") && path === reqPaths[idx]);
        return matchNumber.length === routePath.filter((p) => !p.startsWith(":")).length ? true : false;
    } else { return false; }
};

export class RouteService {
    public routes: IRoute[] = [];

    public get<T>(path: string, handler: (ctx: ICtx<T>) => void) {
        this.routes.push({ method: "GET", path, handler });
        return this;
    }

    public post<T>(path: string, handler: (ctx: ICtx<T>) => void) {
        this.routes.push({ method: "POST", path, handler });
        return this;
    }
}
