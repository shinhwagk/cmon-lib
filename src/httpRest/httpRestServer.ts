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

export function createHttpRestServer(...router: IRoute[]) {
    const server = http.createServer(
        (request: http.IncomingMessage, response: http.ServerResponse) => {
            const route: IRoute = router.filter(routeMatch(request.method as string, request.url as string))[0];
            const reqctx = { body: [], param: {} };
            const ctx: ICtx<any> = { res: response, req: reqctx } as ICtx<any>;
            ctx.res.setHeader("Content-Type", "application/json");
            if (route) {
                const params = extractReqUrlParams(request.url as string, route.path as string);
                const body: Buffer[] = [];
                request.on("data", (chunk: Buffer) => body.push(chunk));
                request.on("end", () => { ctx.req.body = body; ctx.req.param = params; route.handler(ctx) });
            } else {
                response.writeHead(500); response.end("route not match.");
            }
        });
    server.on("clientError", (socket) => {
        socket.end("HTTP/1.1 400 Bad Request\r\n\r\n");
    });
    return server;
}

export const routeMatch = (reqMethod: string, reqUrl: string) => (routeUrl: IRoute) => {
    if (reqMethod === routeUrl.method) {
        const routePaths = routeUrl.path.split("/").slice(1);
        const reqPaths = reqUrl.split("/").slice(1);
        const matchedPaths = routePaths.filter((path, idx) => !path.startsWith(":") && path === reqPaths[idx]);
        return matchedPaths.length === routePaths.filter((p) => !p.startsWith(":")).length ? true : false;
    } else { return false; }
};

export const extractReqUrlParams = <T>(reqUrl: string, routeUrl: string) => {
    const reqPaths = reqUrl.split("/").slice(1);
    const routePaths = routeUrl.split("/").slice(1);
    const routePathAndIndex: Array<[string, number]> = routePaths.map<[string, number]>((path, idx) => [path, idx]);
    const extractedPath = routePathAndIndex.filter(([path,]) => path.startsWith(":"));
    const params: any = {};
    for (const [path, index] of extractedPath) {
        params[path.substr(1)] = reqPaths[index];
    }
    return params as T;
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
