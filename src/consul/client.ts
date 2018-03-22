import * as httpRest from "../httpRest.index";

export interface ConsulService {
    "ServiceID": string;
    "ServiceName": string;
    "ServiceTags": string[];
    "ServiceAddress": string;
    "ServicePort": number;
    "ServiceEnableTagOverride": boolean
}

export function getServiceByName(name: string): Promise<ConsulService[]> {
    const options = httpRest.ReqOptions("consul.cmon.org", "GET", `/v1/catalog/service/${name}`, 8500)
    return httpRest.createHttpRestClient(options)
}