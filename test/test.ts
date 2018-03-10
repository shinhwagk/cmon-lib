import * as tasks from "../src/index";

const routeService = new tasks.httpRestServer.RouteService();
routeService.get<{ id: number }>("/id/:id", (ctx) => { console.info(ctx.req.param.id); });

tasks.httpRestServer.createHttpRestServer(...routeService.routes);
