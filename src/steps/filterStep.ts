import { IEmitDownStream, IStep } from "../step";

export function FilterStep<P, M>(name: string, filterFunc: (elem: M) => boolean): IStep<P, M> {
    name = "Filter-" + name;
    const stepProcess = (emit: IEmitDownStream<P, M>) =>
        (point: P, elem: M) => { if (filterFunc(elem)) { emit(point, elem); } };
    return { name, stepProcess };
}
