import * as http from "http";

function markOptions(hostname: string, method: string, path: string, port: number): http.RequestOptions {
    const headers: http.OutgoingHttpHeaders = method === "GET" ? {} : { "Content-Type": "application/json" };
    return { headers, hostname, method, path, port };
}

function httpRequest<R>(options: http.RequestOptions, reqbody?: string): Promise<R> {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            res.setEncoding("utf8");
            const resbody: Buffer[] = [];
            res.on("data", (chunk: Buffer) => {
                resbody.push(chunk);
                resolve(JSON.parse(resbody.toString()) as R);
            });
            res.on("end", () => null);
        });

        req.on("error", (e) => { console.error(`problem with request: ${e.message}`); reject(e); });

        if (reqbody && options.method === "POST") { req.write(reqbody); }
        req.end();
    });
}

export { markOptions, httpRequest };
