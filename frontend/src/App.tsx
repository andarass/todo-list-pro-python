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

  // Untuk membuat input text
  const [input, setInput] = useState("");

  // Untuk atur dark mode
  const [darkMode, setDarkMode] = useState(() => {
    const data = localStorage.getItem("darkMode");
    return data === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Untuk kondisi awal buka web default filter "all"
  const [filter, setFilter] = useState("all");

  // Untuk memfilter all, pending dan done
  const filteredTodos = todos.filter((todo) => {
    if (filter === "done") return todo.done;
    if (filter === "pending") return !todo.done;
    return true;
  });

  // Variable untuk hitung total task (jumlah isi array)
  const totalTask = todos.length;

  // Variable untuk hitung task done (ambil task yang done = true)
  const doneTask = todos.filter((todo) => todo.done).length;

  // Variable untuk hitung task pending (ambil task yang done = false / undone)
  const pendingTask = todos.filter((todo) => !todo.done).length;

  // Variable untuk state search (menyimpan tulisan user ketika search dengan menggambungkan status + filter)
  const [search, setSearch] = useState("");

  function tambahTugas() {
    if (input.trim() === "") return;

    setTodos([...todos, { text: input, done: false }]);
    setInput("");
  }

  function editTugas(indexEdit: number) {
    const textBaru = prompt("Edit tugas:", todos[indexEdit].text);

    if (!textBaru || textBaru.trim() === "") return;

    const tugasBaru = [...todos];
    tugasBaru[indexEdit].text = textBaru;

    setTodos(tugasBaru);
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
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? "bg-slate-900" : "bg-slate-100"
      }`}
    >
      <div
        className={`w-full max-w-xl rounded-2xl shadow-xl p-6 ${
          darkMode ? "bg-slate-800 text-white" : "bg-white text-black"
        }`}
      >
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded-xl border"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-6">To-Do Web App</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Masukkan tugas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={tambahTugas}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Tambah
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-lg ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("done")}
            className={`px-3 py-1 rounded-lg ${
              filter === "done"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Done
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl text-center text-black">
            <p className="text-sm">Total</p>
            <p className="text-2xl font-bold">{totalTask}</p>
          </div>

          <div className="bg-green-100 p-3 rounded-xl text-center text-black">
            <p className="text-sm">Done</p>
            <p className="text-2xl font-bold">{doneTask}</p>
          </div>

          <div className="bg-yellow-100 p-3 rounded-xl text-center text-black">
            <p className="text-sm">Pending</p>
            <p className="text-2xl font-bold">{pendingTask}</p>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTodos.map((todo, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-xl ${
                darkMode ? "bg-slate-700" : "bg-slate-50"
              }`}
            >
              <span
                className={`flex-1 ${
                  todo.done ? "line-through text-gray-400" : ""
                }`}
              >
                {todo.text}
              </span>

              <div className="flex gap-2 ml-3">
                <button
                  onClick={() => toggleDone(index)}
                  className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                >
                  ✔
                </button>

                <button
                  onClick={() => editTugas(index)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                >
                  ✏
                </button>

                <button
                  onClick={() => hapusTugas(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
