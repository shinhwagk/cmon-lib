export interface IStep<P, M> {
    name: string; stepProcess?: IStepProcess<P, M>; selfProcess?: any;
}

export interface IStepProcess<P, M> {
    (emit: IEmitDownStream<P, M>): (point: P, metric: M) => void;
}

export type IEmitDownStream<P, M> = (point: P, metric: M) => void;

export function Grap<P, Out, In>(u: IStep<P, Out>, ...d: Array<IStep<P, In>>): [IStep<P, Out>, Array<IStep<P, In>>] { return [u, d] }
