import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableItem({
  todo,
  toggleDone,
  hapusTugas,
  editTugas,
  darkMode,
}: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 250ms ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-xl transition duration-300 hover:shadow-md hover:-translate-y-1 ${
        darkMode ? "bg-slate-700" : "bg-slate-50"
      }`}
    >
      {/* DRAG HANDLE */}
      <span
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing touch-none px-2 py-1 mr-3"
      >
        ☰
      </span>

      <span
        className={`flex-1 ${todo.done ? "line-through text-gray-400" : ""}`}
      >
        {todo.text}
      </span>

      <div className="flex gap-2 ml-3">
        <button
          onClick={() => toggleDone(todo.id)}
          className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out"
        >
          ✔
        </button>

        <button
          onClick={() => editTugas(todo.id)}
          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition duration-300 ease-in-out"
        >
          ✏
        </button>

        <button
          onClick={() => hapusTugas(todo.id)}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default SortableItem;
