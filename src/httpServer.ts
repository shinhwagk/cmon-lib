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

export const createHttpServer = (...router: IRoute[]) => http.createServer(
    (request: http.IncomingMessage, response: http.ServerResponse) => {
        const route: IRoute = router.filter(routeMatch(request.method as string, request.url as string))[0];
        const ctx: ICtx<any> = {} as ICtx<any>;
        if (route) {
            const body: Buffer[] = [];
            request.on("data", (chunk: Buffer) => {
                body.push(chunk);
                ctx.req.body = body;
                ctx.req.param = JSON.parse(body.toString());
                ctx.res = response;
            });
            request.on("end", () => route.handler(ctx));
        } else {
            response.writeHead(500);
            response.end("route not match.");
        }

    });

export const routeMatch = (reqMethod: string, reqUrl: string) => (route: IRoute) => {
    if (reqMethod === route.method) {
        const routePath = route.path.split("/").slice(1);
        const reqPaths = reqUrl.split("/").slice(1);
        const matchNumber = routePath.filter((path, idx) => !path.startsWith(":") && path === reqPaths[idx]);
        return matchNumber.length === routePath.filter((p) => !p.startsWith(":")).length ? true : false;
    } else { return false; }
};

class RouteServer {
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
