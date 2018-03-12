import { createHttpRestServer, ICtx, IRoute } from "../httpRestServer";

import { IEmitDownStream, IStep } from "../step";

export function HttpServerStep<P, M, R>(name: string, method: string, path: string,
                                     port: number, h: (emit: any) => (ctx: ICtx<R>) => void): IStep<P, M> {
    name = "HttpServer-" + name;
    const selfProcess = (emit: IEmitDownStream<P, M>) => {
        const route: IRoute = { method, path, handler: h(emit) };
        createHttpRestServer(route).listen(port, "0.0.0.0");
    };
    return { name, selfProcess };
}
