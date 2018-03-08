import * as Influx from "influx";

import { IStep } from "../IStep";

function InfluxStep<P, M>(name: string, database: string, measurement: string,
                          tags: (point: P, elem: M) => {},
                          values: (point: P, elem: M) => {}): IStep {
    name = "Influx-" + name;

    const influx = new Influx.InfluxDB({ host: "influxdb.cmons.org", database });

    const stepProcess = (emit: any) => (point: P, elem: M) => {
        console.info(new Date(), elem, point, tags(point, elem), values(point, elem));
        influx.writePoints([
            {
                fields: values(point, elem),
                measurement,
                tags: tags(point, elem),
                timestamp: (new Date()).getTime() * 1000 * 1000,
            },
        ]);
    };
    return { name, stepProcess };
}
