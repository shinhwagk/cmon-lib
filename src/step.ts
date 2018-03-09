export interface IStep {
    name: string; stepProcess?: any; selfProcess?: any;
}

export type IEmitDownStream<P, M> = (p: P, m: M) => void;
