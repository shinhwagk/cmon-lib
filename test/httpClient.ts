import * as assert from "assert";
import * as http from "http";
import * as mocha from "mocha";

import * as httpClient from "../src/httpClient";
import * as httpServer from "../src/httpServer";

describe("http client", () => {
    const port = 9000;
    const postBody = `{”name“:"world"}`;
    let hs: http.Server;

    before(() => {
        const reqResult = { name: "hello" };
        const routeService = new httpServer.RouteService();
        routeService.get("/", (ctx) => { ctx.res.end(JSON.stringify(reqResult), "utf-8"); });
        routeService.get("/test", (ctx) => { ctx.res.end(JSON.stringify(reqResult), "utf-8"); });
        routeService.post("/test", (ctx) => { ctx.res.end(JSON.stringify(reqResult), "utf-8"); });
        routeService.post<{ id: number }>("/user/:id", (ctx) => {
            const id = ctx.req.param.id;
            const name = JSON.parse(ctx.req.body.toString()).name;
            ctx.res.end(JSON.stringify({ name: name + "-" + id }), "utf-8");

        });
        hs = httpServer.createHttpServer(...routeService.routes).listen(port);
    });

    it(`http client get response return hello1`, (done) => {
        const options = httpClient.markOptions("127.0.0.1", "GET", "/", port);
        const pResult = httpClient.httpRequest<{ name: string }>(options);
        pResult.then((result) => {
            assert.equal(result.name, "hello");
            done();
        });
    });

    it(`http client get response return hello2`, (done) => {
        const options = httpClient.markOptions("127.0.0.1", "GET", "/test", port);
        const pResult = httpClient.httpRequest<{ name: string }>(options);
        pResult.then((result) => {
            assert.equal(result.name, "hello");
            done();
        });
    });

    it(`http client post response return hello2`, (done) => {
        const options = httpClient.markOptions("127.0.0.1", "POST", "/test", port);
        const pResult = httpClient.httpRequest<{ name: string }>(options);
        pResult.then((result) => {
            assert.equal(result.name, "hello");
            done();
        });
    });

    const testdata3 = [1, 2, 3, 4];
    testdata3.forEach((id) => {
        it(`http client post response return xiaoming-${id}`, (done) => {
            const options = httpClient.markOptions("127.0.0.1", "POST", `/user/${id}`, port);
            const pResult = httpClient.httpRequest<{ name: string }>(options, `{"name":"xiaoming"}`);
            pResult.then((result) => {
                assert.equal(result.name, `xiaoming-${id}`);
                done();
            });
        });
    });

    after(() => {
        console.info("close http server.");
        hs.close();
    });

});
