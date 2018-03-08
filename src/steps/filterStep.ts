import { IEmitDownStream, IStep } from "../step";

function FilterStep<P, M>(name: string, filterFunc: (elem: M) => boolean): IStep {
    name = "Filter-" + name;
    const stepProcess = (emit: IEmitDownStream) =>
        (point: P, elem: M) => { if (filterFunc(elem)) { emit(point, elem); } };
    return { name, stepProcess };
}
