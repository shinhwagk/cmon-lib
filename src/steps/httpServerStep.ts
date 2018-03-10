import { createHttpRestServer, ICtx, IRoute } from "../httpRestServer";

import { IStep } from "../step";

export function HttpServerStep<P, M>(name: string, method: string, path: string,
                                     port: number, h: (emit: any) => (ctx: ICtx<any>) => void): IStep {
    name = "HttpServer-" + name;
    const selfProcess = (emit: any) => {
        const route: IRoute = { method, path, handler: h(emit) };
        createHttpRestServer(route).listen(port, "0.0.0.0");
    };
    return { name, selfProcess };
}
