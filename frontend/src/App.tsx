import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import SortableItem from "../src/SortableItem";

type Todo = {
  id: string;
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

  // Variable untuk state search (menyimpan tulisan user ketika search dengan menggambungkan status + filter)
  const [search, setSearch] = useState("");

  // Variable untuk melakukan sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  // Variable untuk memfilter all, pending dan done + component untuk search engine (cocokFilter untuk cek status, cocokSearch untuk cari tugas/search engine)
  const filteredTodos = todos.filter((todo) => {
    const cocokFilter =
      filter === "done" ? todo.done : filter === "pending" ? !todo.done : true;

    const cocokSearch = todo.text.toLowerCase().includes(search.toLowerCase());

    return cocokFilter && cocokSearch;
  });

  // Variable untuk hitung total task (jumlah isi array)
  const totalTask = todos.length;

  // Variable untuk hitung task done (ambil task yang done = true)
  const doneTask = todos.filter((todo) => todo.done).length;

  // Variable untuk hitung task pending (ambil task yang done = false / undone)
  const pendingTask = todos.filter((todo) => !todo.done).length;

  function tambahTugas() {
    if (input.trim() === "") return;

    setTodos([...todos, { id: crypto.randomUUID(), text: input, done: false }]);
    setInput("");
  }

  function editTugas(id: string) {
    const target = todos.find((t) => t.id === id);
    const textBaru = prompt("Edit tugas:", target?.text);

    if (!textBaru) return;

    setTodos(todos.map((t) => (t.id === id ? { ...t, text: textBaru } : t)));
  }

  function hapusTugas(id: string) {
    setTodos(todos.filter((t) => t.id !== id));
  }

  function toggleDone(id: string) {
    const tugasBaru = todos.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTodos(tugasBaru);
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((item) => item.id === active.id);
    const newIndex = todos.findIndex((item) => item.id === over.id);

    setTodos(arrayMove(todos, oldIndex, newIndex));
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition duration-500 ${
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
            className="px-4 py-2 rounded-xl border transition duration-300 ease-in-out"
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
            className={`flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 transition duration-300
              ${
                darkMode
                  ? "bg-slate-800 text-white placeholder:text-gray-400 border-slate-600"
                  : "bg-white text-black placeholder:text-gray-500 border-gray-300"
              }`}
          />

          <button
            onClick={tambahTugas}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition duration-300 ease-in-out"
          >
            Tambah
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg transition duration-300 ease-in-out ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-lg transition duration-300 ease-in-out ${
              filter === "pending"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("done")}
            className={`px-3 py-1 rounded-lg transition duration-300 ease-in-out ${
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

        <input
          type="text"
          placeholder="Cari tugas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full border rounded-xl px-4 py-2 mb-4 transition duration-300 ${
            darkMode
              ? "bg-slate-800 text-white placeholder:text-gray-400 border-slate-600"
              : "bg-white text-black placeholder:text-gray-500 border-gray-300"
          }`}
        />

        {filteredTodos.length === 0 && (
          <p className="text-center text-gray-400">Tidak ada tugas ditemukan</p>
        )}

        <div className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredTodos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredTodos.map((todo) => (
                <SortableItem
                  key={todo.id}
                  todo={todo}
                  toggleDone={toggleDone}
                  hapusTugas={hapusTugas}
                  editTugas={editTugas}
                  darkMode={darkMode}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default App;
