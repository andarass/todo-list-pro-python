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
  deadline: string;
  priority: string;
  doneDate?: string;
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

  // Variable untuk mengatur deadline
  const [deadline, setDeadline] = useState("");

  // Variable untuk mengatur prioritas
  const [priority, setPriority] = useState("Low");

  // Var untuk atur sidebar open and close
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Var untuk state page untuk view sidebar
  const [view, setView] = useState("inbox");

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

  const today = new Date().toISOString().split("T")[0];

  // Variable untuk memfilter all, pending dan done + component untuk search engine (cocokFilter untuk cek status, cocokSearch untuk cari tugas/search engine)
  const filteredTodos = todos.filter((todo) => {
    const cocokSearch = todo.text.toLowerCase().includes(search.toLowerCase());

    if (!cocokSearch) return false;

    // FILTER TOP MENU
    if (filter === "done" && !todo.done) return false;
    if (filter === "pending" && todo.done) return false;

    // FILTER SIDEBAR
    if (view === "today" && todo.deadline !== today) return false;

    if (view === "completed" && !todo.done) return false;

    if (view === "priority" && todo.priority !== "High") return false;

    if (view === "upcoming" && todo.deadline <= today) return false;

    return true;
  });

  // Variable untuk hitung total task (jumlah isi array)
  const totalTask = todos.length;

  // Variable untuk hitung task done (ambil task yang done = true)
  const doneTask = todos.filter((todo) => todo.done).length;

  // Variable untuk hitung task pending (ambil task yang done = false / undone)
  const pendingTask = todos.filter((todo) => !todo.done).length;

  function tambahTugas() {
    if (input.trim() === "") return;

    setTodos([
      ...todos,
      {
        id: crypto.randomUUID(),
        text: input,
        done: false,
        deadline: deadline,
        priority: priority,
        doneDate: "",
      },
    ]);
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
    const today = new Date().toISOString().split("T")[0];

    const tugasBaru = todos.map((t) =>
      t.id === id
        ? {
            ...t,
            done: !t.done,
            doneDate: !t.done ? today : "",
          }
        : t
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

  // Var untuk catat waktu
  const hour = new Date().getHours();

  // Var untuk membuat ucapan otomatis sesuai waktu
  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  // Var untuk menampilkan progress task user
  const progress =
    totalTask === 0 ? 0 : Math.round((doneTask / totalTask) * 100);

  // Var untuk nama hari
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Var untuk show data dummy weekly data
  const weeklyData = days.map((day, index) => {
    const count = todos.filter((todo) => {
      if (!todo.doneDate) return false;

      const date = new Date(todo.doneDate);
      return date.getDay() === index;
    }).length;

    return {
      day,
      value: count * 20,
    };
  });

  return (
    <div
      className={`min-h-screen flex transition ${
        darkMode ? "bg-slate-900 text-white" : "bg-[#f7f7f5] text-[#191919]"
      }`}
    >
      {/* SIDEBAR */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } min-h-screen border-r p-6 transition-all duration-300 ${
          darkMode
            ? "border-slate-700 bg-slate-950"
            : "border-gray-200 bg-white"
        }`}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-6 text-sm text-gray-500 hover:text-black"
        >
          {sidebarOpen ? "← Close" : "→"}
        </button>

        {sidebarOpen && (
          <h2 className="text-xl font-semibold mb-8">Workspace</h2>
        )}

        {/* DASHBOARD STAT */}
        <div className="space-y-2 text-sm">
          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setView("inbox")}>
            📥 {sidebarOpen && "Inbox"}
          </button>

          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setView("today")}>
            📅 {sidebarOpen && "Today"}
          </button>

          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setView("upcoming")}>
            🗓 {sidebarOpen && "Upcoming"}
          </button>

          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setView("completed")}>
            ✅ {sidebarOpen && "Completed"}
          </button>

          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setView("priority")}>
            🔥 {sidebarOpen && "Priority"}
          </button>

          <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => setView("settings")}>
            ⚙ {sidebarOpen && "Settings"}
          </button>
        </div>

        <div className="mt-8">
          {sidebarOpen && (
            <h3 className="text-lg font-semibold mb-4">Weekly Productivity</h3>
          )}

          {sidebarOpen && (
            <div className="space-y-3">
              {weeklyData.map((item) => (
                <div key={item.day}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.day}</span>
                    <span>{item.value}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 p-8">
        {/* CARD UTAMA */}
        <div
          className={`w-full max-w-3xl mx-auto mt-10 border rounded-2xl p-8 ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-white"
              : "bg-white border-gray-200 text-black"
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

          {/* GREETING SECTION */}
          <div className="mb-8">
            <h1 className="text-4xl font-semibold tracking-tight">
              {greeting}, Andara 👋
            </h1>

            <p className="text-gray-500 mt-2">
              You have {pendingTask} pending task{pendingTask !== 1 ? "s" : ""}{" "}
              today.
            </p>
          </div>

          {/* PROGRESS BAR ANIMATED */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{progress}%</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-black h-3 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-400">Total</p>
              <p className="text-2xl font-semibold">{totalTask}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-400">Done</p>
              <p className="text-2xl font-semibold">{doneTask}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-400">Pending</p>
              <p className="text-2xl font-semibold">{pendingTask}</p>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-sm text-gray-400">Progress</p>
              <p className="text-2xl font-semibold">{progress}%</p>
            </div>
          </div>

          <div
            className={`rounded-xl p-4 space-y-3 mb-6 shadow-sm transition ${
              darkMode
                ? "bg-slate-800 border border-slate-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <input
              type="text"
              placeholder="Masukkan tugas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full text-lg py-2 outline-none placeholder:text-gray-400 transition duration-300
              ${
                darkMode
                  ? "bg-slate-800 text-white placeholder:text-gray-400 border-slate-600"
                  : "bg-white text-black placeholder:text-gray-500 border-gray-300"
              }`}
            />
          </div>

          <div className="flex gap-2 mb-6">
            <input
              type="date"
              value={deadline}
              className={`border rounded-xl px-4 py-2 ${
                darkMode
                  ? "bg-slate-800 text-white placeholder:text-gray-400 border-slate-600"
                  : "bg-white text-black placeholder:text-gray-500 border-gray-300"
              }`}
              onChange={(e) => setDeadline(e.target.value)}
            />

            <select
              value={priority}
              className={`border rounded-xl px-4 py-2 ${
                darkMode
                  ? "bg-slate-800 text-white placeholder:text-gray-400 border-slate-600"
                  : "bg-white text-black placeholder:text-gray-500 border-gray-300"
              }`}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <button
              onClick={tambahTugas}
              className="px-5 py-2 rounded-xl bg-black text-white hover:scale-[1.02] active:scale-95 transition"
            >
              Tambah
            </button>
          </div>

          {/* <div className="flex gap-2 mb-6">
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
          </div> */}

          {/* <div className="grid grid-cols-3 gap-3 mb-6">
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
        </div> */}

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
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-2">✨</p>
              <p className="text-lg font-medium">No tasks yet</p>
              <p className="text-sm">Start by adding your first priority.</p>
            </div>
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
    </div>
  );
}

export default App;
