import * as mysql from "mysql";

export function query<R>(connConf: mysql.ConnectionConfig, sql: string, callback: (rs: R[]) => void) {
    const connection = mysql.createConnection(connConf);
    connection.connect();
    connection.query(sql, (error, results) => {
        if (error) throw error; callback(<R[]>results);
    });
    connection.end();
}