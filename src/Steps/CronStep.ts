import { IStep } from "../step";

function CronStep<P, M>(name: string, interval: number, points: P[], execFunc: (point: P) => Promise<M[]>,
                        single: boolean = true): IStep {
    name = "Cron-" + name;
    const selfProcess = (emit: any) => {
        setInterval(() => {
            const currDate = (new Date()).getTime();
            points.forEach((p) => {
                execFunc(p)
                    .then((r) => {
                        if (single) { r.forEach((x) => emit(p, x)); } else { emit(p, r); }
                    })
                    .catch((e) => console.error(p, e));
            });
        }, interval);
    };

    return { name, selfProcess };
}
