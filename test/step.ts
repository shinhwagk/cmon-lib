import { steps } from "../src/index";

const points = [{ a: 1 }]

interface Ptype { a: number }
interface Mtype { b: number };

const execfunc = (p: { a: number }) => Promise.resolve([{ b: p.a + 1 }]);

const cronstep = steps.CronStep<Ptype, Mtype>("test", 1000, points, execfunc);

const filterstep = steps.FilterStep<Ptype, { c: number }>("test", (p) => p.c === 1);
const filterstep2 = steps.FilterStep<Ptype, { c: number }>("test", (p) => p.c === 1);
steps.Grap(cronstep, [filterstep, filterstep2])