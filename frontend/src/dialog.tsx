// @ts-nocheck
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ListTodo,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function DialogDemo({ product, isOpen, onClose, handleSave, onChange }) {
  const priorityValue = product?.priority || 3;

  const getPriorityLabel = (value) => {
    if (value <= 2) return "Low";
    if (value <= 4) return "Medium";
    return "High";
  };

  // Safe close function to prevent white screen
  const handleClose = () => {
    try {
      if (typeof onClose === "function") {
        onClose();
      }
    } catch (error) {
      console.error("Error closing dialog:", error);
    }
  };

  // Safe save function to prevent white screen
  const handleSaveClick = () => {
    try {
      // First close the dialog to prevent white screen
      handleClose();

      // Then call the save function after a short delay
      setTimeout(() => {
        if (typeof handleSave === "function") {
          handleSave();
        }
      }, 100);
    } catch (error) {
      console.error("Error saving:", error);
      handleClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent
            className="sm:max-w-[500px] p-0 overflow-hidden rounded-xl"
            aria-describedby="dialog-description"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <DialogTitle className="text-xl text-blue-800 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Edit Task
                </DialogTitle>
                <DialogDescription
                  id="dialog-description"
                  className="text-gray-600"
                >
                  Make changes to your task details below.
                </DialogDescription>
              </DialogHeader>

              <div className="p-6">
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <ListTodo className="h-4 w-4 text-blue-600" /> Task Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue={product?.task || ""}
                      onChange={(e) => onChange(e, "task")}
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="Enter task name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="priority"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-500" />{" "}
                      Priority Level
                    </Label>
                    <div>
                      <Input
                        id="priority"
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        defaultValue={priorityValue}
                        onChange={(e) => onChange(e, "priority")}
                        className="w-full accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Low (1)</span>
                        <span>Medium (3)</span>
                        <span>High (5)</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Current value: {priorityValue} -{" "}
                      {getPriorityLabel(priorityValue)} priority
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="image"
                      className="text-sm font-medium flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4 text-purple-600" /> Image
                      URL
                    </Label>
                    <Input
                      id="image"
                      defaultValue={product?.image || ""}
                      onChange={(e) => onChange(e, "image")}
                      className="border-blue-200 focus:border-blue-400"
                      placeholder="Enter image URL"
                    />
                    {product?.image && (
                      <div className="mt-2 rounded-md overflow-hidden border border-gray-200">
                        <img
                          src={product.image}
                          alt="Task preview"
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <Separator className="my-5" />

                <DialogFooter className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="border-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveClick}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
