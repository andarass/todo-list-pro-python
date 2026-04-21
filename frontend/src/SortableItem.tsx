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

  const isOverdue =
    todo.deadline && new Date(todo.deadline) < new Date() && !todo.done;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
        darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-200"
      }`}
    >
      {/* DRAG HANDLE */}
      <div className="flex gap-3 flex-1">
        <span
          {...attributes}
          {...listeners}
          className="cursor-grab mt-1 text-gray-400"
        >
          ☰
        </span>

        <div className="flex-1">
          <p
            className={`font-medium text-lg ${
              todo.done ? "line-through text-gray-400" : ""
            }`}
          >
            {todo.text}
          </p>

          <div className="text-sm text-gray-400 mt-1 flex gap-2 flex-wrap">
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                todo.priority === "High"
                  ? "bg-red-100 text-red-600"
                  : todo.priority === "Medium"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {todo.priority}
            </span>
            <span>•</span>
            <span className="text-gray-400 text-xs">
              {todo.deadline || "No deadline"}
            </span>
            {isOverdue && (
              <span className="px-2 py-1 rounded-md text-xs bg-red-500 text-white">
                OVERDUE
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex gap-2 ml-3">
          <button
            onClick={() => toggleDone(todo.id)}
            className="px-3 py-1 rounded-lg bg-green-500 text-white hover:opacity-90 transition duration-300 ease-in-out"
          >
            ✔
          </button>

          <button
            onClick={() => editTugas(todo.id)}
            className="px-3 py-1 rounded-lg bg-yellow-500 text-white hover:opacity-90 transition duration-300 ease-in-out"
          >
            ✏
          </button>

          <button
            onClick={() => hapusTugas(todo.id)}
            className="px-3 py-1 rounded-lg bg-red-500 text-white hover:opacity-90 transition duration-300 ease-in-out"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default SortableItem;
