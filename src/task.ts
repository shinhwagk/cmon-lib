import { EventEmitter } from "events";

import { IStep } from "./step";

export function RunTasks(flow: Array<[IStep<any, any>, Array<IStep<any, any>>]>) {
    const ee: EventEmitter = new EventEmitter();
    const isds: { [name: string]: string[] } = {};
    const dSteps: IStep<any, any>[] = [];


    const registerDownStream = (name: string, pname: string) => {
        if (!isds[name]) { isds[name] = []; }
        isds[name].push(pname);
    };

    const registerListener = (name: string, listener: (...args: any[]) => void) => {
        ee.on(name, listener);
    };

    const addStepIfNoExist = (is: IStep<any, any>) => { if (dSteps.indexOf(is) === -1) { dSteps.push(is); } };

    if (flow.length <= 1) {
        console.error("flow empty.");
        return;
    } else {
        for (const [is, diss] of flow) { // down stream istep

            const { name, } = is;

            addStepIfNoExist(is);

            diss.forEach((s) => registerDownStream(name, s.name));

            diss.forEach((s) => addStepIfNoExist(s));
        }
    }

    const startFlow = () => {
        const rSteps = dSteps.reverse();
        for (const step of rSteps) {
            const name = step.name;
            const dNames: string[] = isds[name] || [];
            const emitFunc = (point: any, elem: any) => dNames.forEach((dname) => {
                console.info(`send to ${dname}, point:${point.name}.`);
                ee.emit(dname, point, elem);
            });

            if (step.stepProcess) {
                console.info(`start listen ${step.name}.`);
                registerListener(step.name, step.stepProcess(emitFunc));
            }

            if (step.selfProcess) {
                console.info(`start localProcess ${step.name}.`);
                step.selfProcess(emitFunc);
            }
        }
    };

    startFlow();
}
