import { IStep } from "../IStep";

function PrintStep<P, M>(name: string, PrintFunc: (point: P, elemt: M) => void): IStep {
    name = "Print-" + name;
    const stepProcess = (emit: any) => (point: P, elem: M) => PrintFunc(point, elem);
    return { name, stepProcess };
}
