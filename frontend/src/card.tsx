// @ts-nocheck
import "./App.css";
import { motion } from "framer-motion";
import { Edit2, Trash2, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getPriorityColor = (priority) => {
  const priorityNum = parseInt(priority.split(": ")[1]);
  if (priorityNum <= 2) return "bg-green-100 text-green-800 border-green-300";
  if (priorityNum <= 4)
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-red-100 text-red-800 border-red-300";
};

const getPriorityLabel = (priority) => {
  const priorityNum = parseInt(priority.split(": ")[1]);
  if (priorityNum <= 2) return "Low";
  if (priorityNum <= 4) return "Medium";
  return "High";
};

const Card = (props) => {
  const priorityClass = getPriorityColor(props.text);
  const priorityLabel = getPriorityLabel(props.text);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-full max-w-xs bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative">
        <img src={props.img} alt="Task" className="h-40 w-full object-cover" />
        <div className="absolute top-2 right-2">
          <Badge
            className={`${priorityClass} font-medium flex items-center gap-1 px-2 py-1`}
          >
            {priorityLabel === "High" ? (
              <AlertCircle className="w-3 h-3" />
            ) : (
              <Clock className="w-3 h-3" />
            )}
            {priorityLabel}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h2 className="font-bold text-lg mb-2 text-gray-800 line-clamp-1">
          {props.title}
        </h2>
        <p className="text-gray-600 text-sm mb-4">{props.text}</p>
        <div className="flex justify-between items-center">
          <button
            onClick={props.edit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200"
          >
            <Edit2 className="w-4 h-4" /> Edit
          </button>
          <button
            onClick={props.delete}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;
