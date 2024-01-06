import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import z from "zod";
import cors from "cors";

const t = trpc.initTRPC.create();

const TodoSchema = z.object({
  title: z.string(),
  description: z.string(),
  author: z.string(),
});

export type Todo = z.infer<typeof TodoSchema>;

const todos: Todo[] = [];

const appRouter = t.router({
  greating: t.procedure.query(() => {
    return "Hello World";
  }),

  greating2: t.procedure.query(() => {
    for (let i = 0; i < 1000000000; i++) {}

    return "Hello World 2";
  }),

  addNewTodo: t.procedure.input(TodoSchema).mutation(({ input }) => {
    todos.push(input);
    return todos;
  }),
});

export type AppRouter = typeof appRouter;

const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({});

const app = express();

app.use(cors({ origin: "*" }));

const trpcMiddleware = trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext,
});

app.use("/api/trpc", trpcMiddleware);

const PORT = 3000;

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
