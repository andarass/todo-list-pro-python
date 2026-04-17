import { useEffect, useState } from "react";

type Todo = {
  text: string;
  done: boolean;
};
function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const data = localStorage.getItem("todos");
    return data ? JSON.parse(data) : [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const [input, setInput] = useState("");

  function tambahTugas() {
    if (input.trim() === "") return;

    setTodos([...todos, { text: input, done: false }]);
    setInput("");
  }

  function hapusTugas(indexHapus: number) {
    const tugasBaru = todos.filter((_, index) => index !== indexHapus);
    setTodos(tugasBaru);
  }

  function toggleDone(indexTarget: number) {
    const tugasBaru = [...todos];
    tugasBaru[indexTarget].done = !tugasBaru[indexTarget].done;
    setTodos(tugasBaru);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>To-Do Web App</h1>

      <input
        type="text"
        placeholder="Masukkan tugas"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={tambahTugas}>Tambah</button>

      <hr />

      {todos.map((todo, index) => (
        <div key={index}>
          <span style={{ textDecoration: todo.done ? "line-through" : "none" }}>
            {index + 1}. {todo.text}
          </span>
          <button onClick={() => toggleDone(index)}>
            {todo.done ? "Batal" : "Selesai"}
          </button>
          <button onClick={() => hapusTugas(index)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}

export default App;
