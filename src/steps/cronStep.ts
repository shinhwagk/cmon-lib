import { IEmitDownStream, IStep } from "../step";

export function CronStep<P, M>(name: string, interval: number, points: P[],
                               execFunc: (point: P) => Promise<M[]>,
                               single: boolean = true): IStep<P, M> {
    name = "Cron-" + name;
    const selfProcess = (emit: IEmitDownStream<P, M[] | M>) => {
        setInterval(() => {
            // const currDate = (new Date()).getTime();
            points.forEach((point) => {
                execFunc(point).then((elems: M[]) => {
                    if (single) { elems.forEach((elem) => emit(point, elem)); } else { emit(point, elems); }
                }).catch((e) => console.error(point, e));
            });
        }, interval);
    };

    return { name, selfProcess };
}
