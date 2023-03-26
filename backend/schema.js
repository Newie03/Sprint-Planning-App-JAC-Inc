const schema = `
    type Query {
        tasks: [Task]
    },

    type Task {
        sprint : String
        status: String
        description: String
        member: String
        cost: Int
        estimate: Int
    },

    type Mutation {
        addTask(sprint: String, status: String, description: String, member: String, cost: Int, estimate: Int): Task,
        updateTask(sprint: String, status: String, description: String, member: String, cost: Int, estimate: Int): Task
    }

`

export {schema};