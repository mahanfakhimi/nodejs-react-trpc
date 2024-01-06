import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { AppRouter, Todo } from "../../server/server";

const client = createTRPCProxyClient<AppRouter>({
  links: [httpBatchLink({ url: "http://localhost:3000/api/trpc" })],
});

const App = () => {
  const [values, setValues] = useState({
    title: "",
    description: "",
    author: "",
  });

  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    (async () => {
      await Promise.all([client.greating.query(), client.greating2.query()]);
    })();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValues((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await client.addNewTodo.mutate(values);

    setTodos(res);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="todo title"
          name="title"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="todo description"
          name="description"
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="todo author"
          name="author"
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>

      {todos &&
        todos.map((todo) => (
          <div>
            {todo.title} ----- {todo.description} ----- {todo.author}
          </div>
        ))}
    </div>
  );
};

export default App;
