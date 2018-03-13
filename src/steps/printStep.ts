import { IStep, IStepProcess } from "../step";

export function PrintStep<P, M>(name: string, PrintFunc: (point: P, elemt: M) => void): IStep<P, M> {
    name = "Print-" + name;
    const stepProcess: IStepProcess<P, M> = () => (point: P, elem: M) => PrintFunc(point, elem);
    return { name, stepProcess };
}
