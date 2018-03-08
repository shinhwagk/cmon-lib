import { createHttpServer, ICtx, IRoute } from "../httpServer";

import { IStep } from "../IStep";

export function HttpServerStep<P, M>(name: string, method: string, path: string,
                                     h: (emit: any) => (ctx: ICtx<any>) => void): IStep {
    name = "HttpServer-" + name;
    const selfProcess = (emit: any) => {
        const route: IRoute = { method, path, handler: h(emit) };
        createHttpServer(route).listen(9501);
    };
    return { name, selfProcess };
}
