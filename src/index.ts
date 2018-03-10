import { createHttpRestClient, markOptions } from "./httpRestClient";
import { createHttpRestServer, RouteService } from "./httpRestServer";

const httpRestClient = { createHttpRestClient, markOptions };
const httpRestServer = { createHttpRestServer, RouteService };

export { httpRestClient, httpRestServer };
