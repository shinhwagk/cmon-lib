import { IEmitDownStream, IStep } from "../step";
import { createHttpRestClient, ReqOptions } from "../httpRest.index";

export function CronStep<P, M>(name: string, interval: number, points: P[],
    execFunc: (point: P) => Promise<M[]>,
    single: boolean): IStep<P, M>;

export function CronStep<P, M>(name: string, interval: number, points: Promise<P[]>,
    execFunc: (point: P) => Promise<M[]>,
    single: boolean): IStep<P, M>

export function CronStep<P, M>(name: string, interval: number, points: Promise<P[]> | P[],
    execFunc: (point: P) => Promise<M[]>,
    single: boolean = true): IStep<P, M> {
    name = "Cron-" + name;
    const selfProcess = (emit: IEmitDownStream<P, M[] | M>) => {
        setInterval(() => {
            // const currDate = (new Date()).getTime();
            let ps = points instanceof Promise ? points : Promise.resolve(points);
            ps.then(points => {
                points.forEach((point) => {
                    execFunc(point).then((elems: M[]) => {
                        if (single) { elems.forEach((elem) => emit(point, elem)); } else { emit(point, elems); }
                    }).catch((e) => console.error(point, e));
                });
            })

        }, interval);
    };

    return { name, selfProcess };
}

export function taskEndPoints<P>(kind: string, name: string) {
    const reqOptions = ReqOptions("api.endpoint.database.cmon.org", "GET", `/v1/endpoint/${kind}/task/${name}`, 9500);
    return createHttpRestClient(reqOptions).then(r => r as Array<P>);
}
