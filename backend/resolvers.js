import * as dbRtns from "./db_routines.js";

const resolvers = {
    tasks: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, "tasks", {}, {});
    },
    addTask: async args => {
        let db = await dbRtns.getDBInstance();
        let task = {status: args.status, description: args.description, member: args.member, cost: args.cost, estimate: args.estimate};
        let results = await dbRtns.addOne(db, "tasks", task);
        return results.acknowledged ? task : null;
    }
}

export { resolvers };