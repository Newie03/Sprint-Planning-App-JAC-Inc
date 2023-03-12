const schema = `
    type Query {
        tasks: [Task]
    },

    type Task {
        status: String
        description: String
        member: String
        cost: Int
        estimate: Int
    },

    type Mutation {
        addTask(status: String, description: String, member: String, cost: Int, estimate: Int): Task
    }

`

export {schema};