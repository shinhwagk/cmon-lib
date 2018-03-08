import { EventEmitter } from "events";
import * as http from "http";

import { IStep } from "./IStep";

function RunTasks(flow: Array<[IStep, IStep[]]>) {
    const ee: EventEmitter = new EventEmitter();
    const isds: { [name: string]: string[] } = {};
    const dSteps: IStep[] = [];

    const emit = (...pnames: string[]) => (point: any, data: any) => {
        pnames.forEach((dname) => {
            console.info(`send to ${dname}, point:${point.name}.`);
            ee.emit(dname, point, data);
        });
    };

    const registerDownStream = (name: string, pname: string) => {
        if (!isds[name]) { isds[name] = []; }
        isds[name].push(pname);
    };

    const registerListener = (name: string, listener: (...args: any[]) => void) => {
        ee.on(name, listener);
    };

    const addStepIfNoExist = (is: IStep) => { if (dSteps.indexOf(is) === -1) { dSteps.push(is); } };

    if (flow.length <= 1) {
        console.error("flow empty.");
        return;
    } else {
        for (const [is, diss] of flow) { // down stream istep

            const { name, stepProcess, selfProcess } = is;

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

import * as fs from "fs";
const execCommand = <P extends { ip: string }, M>(name: string) => (p: P) => {
    return new Promise<M[]>((r, x) => {
        http.get(`http://${p.ip}:8000/v1/script/${name}`, (res) => {
            const body: Buffer[] = [];
            res.on("data", (chunk: Buffer) => body.push(chunk));
            res.on("end", () => {
                try {
                    r(JSON.parse(body.toString()) as M[]);
                } catch (e) {
                    console.error("error str " + body + "error str .");
                    console.error(`${e},${body.toString()}`);
                    fs.writeFile("./error.log", e + body.toString(), (e) => console.error(e));
                }
            });
        }).on("error", (e) => console.error(e));
    });
};

const execSql = <P extends { name: string }, R>(sql: string, args: any[]) => (p: P) => {
    const postOptions: http.RequestOptions = {
        headers: { "Content-Type": "application/json" },
        hostname: "sql.cmon.org",
        method: "POST",
        path: `/v1/sql/${p.name}`,
        port: "9500",
    };
    return new Promise<R[]>((r, x) => {
        const req = http.request(postOptions, (res) => {
            const data: Buffer[] = [];
            res.on("data", (chunk: Buffer) => data.push(chunk));
            res.on("end", () => {
                try { r(JSON.parse(data.toString()) as R[]); } catch (e) { x(e); }
            });
            res.on("error", (e) => x(e));
        });
        req.write(JSON.stringify([sql, args]));
        req.end();
    });
};

export { execSql, execCommand, RunTasks };
