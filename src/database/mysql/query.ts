import * as mysql from "mysql";

export function query<R>(connConf: mysql.ConnectionConfig, sql: string, callback: (rs: R[]) => void) {
    const connection = mysql.createConnection(connConf);
    connection.connect();
    connection.query(sql, (error, results) => {
        if (error) throw error; callback(<R[]>results);
    });
    connection.end();
}

export function futureQuery<R>(connConf: mysql.ConnectionConfig, sql: string): Promise<R[]> {
    return new Promise((res, rej) => {
        const connection = mysql.createConnection(connConf);
        connection.connect();
        connection.query(sql, (error, results) => {
            if (error) rej(error); res(results as R[]);
        });
        connection.end();
    })
}