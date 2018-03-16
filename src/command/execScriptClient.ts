import * as http from "http";

export const scriptServiceClient = <P extends { ip: string }, M>(name: string) => (p: P) => {
    return new Promise<M[]>((r) => {
        http.get(`http://${p.ip}:8000/v1/script/${name}`, (res) => {
            const body: Buffer[] = [];
            res.on("data", (chunk: Buffer) => body.push(chunk));
            res.on("end", () => {
                try {
                    r(JSON.parse(body.toString()) as M[]);
                } catch (e) {
                    console.error("error str " + body + "error str .");
                    console.error(`${e},${body.toString()}`);
                }
            });
        }).on("error", (e) => console.error(e));
    });
};