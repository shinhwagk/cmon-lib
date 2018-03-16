import * as http from "http";

export const sqlServiceClient = <P extends { name: string }, R>(sql: string, args: any[]) => (p: P) => {
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
