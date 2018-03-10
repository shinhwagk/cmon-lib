import * as assert from "assert";
import * as mocha from "mocha";

import * as httpServer from "../src/httpServer";

describe("test rest route url match", () => {

    const handler = (ctx: any) => "aa";

    const testData1 = [
        { request: ["POST", "/user/1/a"], route: { method: "POST", path: "/user/:id/a", handler } },
        { request: ["POST", "/users"], route: { method: "POST", path: "/users", handler } },
        { request: ["POST", "/"], route: { method: "POST", path: "/", handler } },
    ];
    testData1.forEach((test) => {
        it(`request url match route url: "${test.request[1]}" ==> "${test.route.path}" args`, () => {
            const matched = httpServer.routeMatch(test.request[0], test.request[1])(test.route);
            assert.ok(matched);
        });
    });

    const testData2 = [
        { request: ["POST", "/user/1/a1"], route: { method: "POST", path: "/user/:id/a", handler } },
        { request: ["POST", "/user"], route: { method: "POST", path: "/users", handler } },
        { request: ["POST", "/1"], route: { method: "POST", path: "/", handler } },
    ];
    testData2.forEach((test) => {
        it(`request url not match route url: "${test.request[1]}" => "${test.route.path}" args`, () => {
            const matched = httpServer.routeMatch(test.request[0], test.request[1])(test.route);
            assert.ok(!matched);
        });
    });
});

describe("test extract url parameter", () => {
    const testdata1: [string, string] = ["/test/1", "/test/:id"];
    const testdata2 = ["/test/1/name/xiaoming", "/test/:id/name/:name"];
    const testdata3 = ["/test/1/val/22", "/test/:id/val/:val"];

    it("params id === 1", () => {
        const [reqUrl, routeUrl] = testdata1;
        const params = httpServer.extractParams<{ id: number }>(reqUrl, routeUrl);
        assert.equal(params.id, 1);
    });
    it("params id === 1, name === xiaoming", () => {
        const [reqUrl, routeUrl] = testdata2;
        const params = httpServer.extractParams<{ id: number, name: string }>(reqUrl, routeUrl);
        assert.equal(params.id, 1);
    });

    it("params id === 1, name === xiaoming", () => {
        const [reqUrl, routeUrl] = testdata3;
        const params = httpServer.extractParams<{ id: number, name: string }>(reqUrl, routeUrl);
        assert.notEqual(params.id, 2);
    });

});
