import { createHttpRestClient, markOptions } from "./httpRestClient";
import { createHttpRestServer, RouteService } from "./httpRestServer";

import { Grap, IStep } from "./step";
import { CronStep } from "./steps/cronStep";
import { FilterStep } from "./steps/filterStep";

const httpRestClient = { createHttpRestClient, markOptions };
const httpRestServer = { createHttpRestServer, RouteService };

const steps = { CronStep, FilterStep, Grap };

export { httpRestClient, httpRestServer, steps };
