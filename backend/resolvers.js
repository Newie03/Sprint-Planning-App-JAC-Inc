import * as dbRtns from "./db_routines.js";

const resolvers = {
    tasks: async () => {
        let db = await dbRtns.getDBInstance();
        return await dbRtns.findAll(db, "tasks", {}, {});
    },
    addTask: async args => {
        let db = await dbRtns.getDBInstance();
        let task = {sprint: args.sprint, status: args.status, description: args.description, member: args.member, cost: args.cost, estimate: args.estimate};
        let results = await dbRtns.addOne(db, "tasks", task);
        return results.acknowledged ? task : null;
    },
    updateTask: async args => {
        let db = await dbRtns.getDBInstance();
        let task = {sprint: args.sprint, status: args.status, description: args.description, member: args.member, cost: args.cost, estimate: args.estimate};
        let results = await dbRtns.updateOne(db, "tasks", {description: task.description}, task);
        return results.acknowledged ? task : null;
    }
}

export { resolvers };