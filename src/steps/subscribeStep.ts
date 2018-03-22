import { IEmitDownStream, IStep } from "../step";
import { createHttpRestServer, ICtx, IRoute } from "../httpRest/httpRestServer";

export function SubscribeStep<P, M, R>(name: string, path: string,
                                    port: number, h: (emit: any) => (ctx: ICtx<R>) => void): IStep<P, M> {screen
    name = "Subscribe-" + name;
    const method = "POST";
    const selfProcess = (emit: IEmitDownStream<P, M>) => {
        const route: IRoute = { method, path, handler: h(emit) };
        createHttpRestServer(route).listen(port, "0.0.0.0");
    };
    return { name, selfProcess };
}
