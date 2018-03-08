import * as assert from "assert";
import * as mocha from "mocha";

import * as httpServer from "../src/httpServer";

describe("route url not match", () => {

    const handler = (ctx: any) => "aa";

    const testData1 = [
        { request: ["POST", "/user/1/a"], route: { method: "POST", path: "/user/:id/a", handler } },
        { request: ["POST", "/users"], route: { method: "POST", path: "/users", handler } },
        { request: ["POST", "/"], route: { method: "POST", path: "/", handler } },
    ];
    testData1.forEach((test) => {
        it(`request url match test route url: "${test.request[1]}" ==> "${test.route.path}" args`, () => {
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
        it(`request url not match test route url: "${test.request[1]}" => "${test.route.path}" args`, () => {
            const matched = httpServer.routeMatch(test.request[0], test.request[1])(test.route);
            assert.ok(!matched);
        });
    });
});
