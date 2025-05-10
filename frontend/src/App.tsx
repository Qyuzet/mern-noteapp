// @ts-nocheck
import React from "react";
import { ProfileForm } from "./form.tsx";
import { AppLayout } from "./layouts/AppLayout";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { CheckCircle2, Plus, ClipboardList } from "lucide-react";
import Card from "./card.tsx";
import { useProductStore } from "./store/product.ts";
import { DialogDemo } from "./dialog.tsx";
import { Button } from "@/components/ui/button";
import "./App.css";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { AuthPage } from "./login.tsx";
import { ProfilePage } from "./profile.tsx";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";

function Welcome() {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  // For non-authenticated users, show the landing page
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold text-blue-800 mb-2">
          Task Management App
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          A simple and efficient way to manage your tasks and stay organized.
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mb-10 flex gap-4 flex-wrap justify-center"
      >
        <Button
          onClick={() => navigate("/login")}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl flex items-center gap-2 text-lg"
        >
          Login / Register
        </Button>

        <a
          href="http://localhost:7778/api-docs/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-6 text-lg font-medium border border-green-600 text-green-600 hover:bg-green-50 rounded-xl transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          API Docs
        </a>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="bg-blue-50 p-6 rounded-xl max-w-md"
      >
        <h4 className="font-medium text-blue-800 mb-2">Features</h4>
        <ul className="text-left text-gray-700 space-y-2">
          {[
            "Create and manage tasks",
            "Set priority levels",
            "Visual task cards",
            "Responsive design",
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

class App extends React.Component {
  // Add a class property to track fetching state
  _isFetching = false;

  constructor(props: object) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      editDialog: false,
      editingProduct: null,
    };
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
    this.handleEditProduct = this.handleEditProduct.bind(this);
    this.submitEditProduct = this.submitEditProduct.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  async componentDidMount(): void {
    await this.fetchData();
  }

  async fetchData(): Promise<void> {
    // Set a loading flag to prevent multiple simultaneous fetches
    if (this._isFetching) {
      console.log("Data fetch already in progress, skipping");
      return;
    }

    this._isFetching = true;

    try {
      // Only show loading state for initial load, not for refreshes
      if (this.state.data.length === 0) {
        this.setState({ loading: true });
      }

      // Fetch products from the store
      await useProductStore.getState().fetchProducts();
      const products = useProductStore.getState().products;

      // Update state with the new data
      this.setState({
        data: products,
        loading: false,
      });

      console.log("Data fetched successfully:", products.length, "items");
    } catch (error) {
      console.error("Error fetching data:", error);

      this.setState({ loading: false });

      // Only show error toast if we have no data
      if (this.state.data.length === 0) {
        toast({
          title: "Error loading tasks",
          description: "Could not load your tasks. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      // Reset the fetching flag
      this._isFetching = false;
    }
  }

  async handleDeleteProduct(pid: string) {
    if (!pid) {
      console.log("No product ID provided for deletion");
      return;
    }

    try {
      console.log("Deleting product with ID:", pid);

      // Show loading toast
      toast({
        title: "Deleting Task",
        description: "Please wait while we delete your task...",
      });

      const { deleteProduct } = useProductStore.getState();
      const { success, message } = await deleteProduct(pid);

      if (success) {
        // Show success toast
        toast({
          title: "Task Deleted",
          description: message || "Your task has been successfully removed.",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });

        // Refresh the data from the server
        await this.fetchData();
      } else {
        toast({
          title: "Deletion Failed",
          description: message || "There was an error deleting your task.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);

      toast({
        title: "Deletion Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error deleting your task.",
        variant: "destructive",
      });

      // Refresh the data to ensure UI is in sync
      try {
        await this.fetchData();
      } catch (fetchError) {
        console.error("Error refreshing data after delete error:", fetchError);
      }
    }
  }

  handleEditProduct(product) {
    this.setState({
      editDialog: true,
      editingProduct: product,
    });
  }

  async submitEditProduct() {
    // Store the editing product before closing the dialog
    const editingProductCopy = this.state.editingProduct
      ? JSON.parse(JSON.stringify(this.state.editingProduct))
      : null;

    // The dialog is already closed by the dialog component

    // If no product to edit, just return
    if (!editingProductCopy || !editingProductCopy._id) {
      console.log("No product to edit");
      return;
    }

    try {
      console.log("Updating product:", editingProductCopy);

      // Show loading toast
      toast({
        title: "Updating Task",
        description: "Please wait while we update your task...",
      });

      const { updateProduct } = useProductStore.getState();

      const { success, message } = await updateProduct(
        editingProductCopy._id,
        editingProductCopy
      );

      if (success) {
        // Show success toast
        toast({
          title: "Task Updated",
          description: message || "Your changes have been saved successfully!",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        });

        // Refresh the data from the server
        await this.fetchData();
      } else {
        toast({
          title: "Update Failed",
          description: message || "There was an error updating your task.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating product:", error);

      toast({
        title: "Update Failed",
        description:
          error instanceof Error
            ? error.message
            : "There was an error updating your task.",
        variant: "destructive",
      });

      // Refresh the data to ensure UI is in sync
      try {
        await this.fetchData();
      } catch (fetchError) {
        console.error("Error refreshing data after update error:", fetchError);
      }
    }
  }

  handleProductChange(e, field) {
    const { value } = e.target;
    this.setState((prevState) => ({
      editingProduct: {
        ...prevState.editingProduct,
        [field]: field === "priority" ? parseFloat(value) : value,
      },
    }));
  }

  render() {
    const { data, loading, editDialog, editingProduct } = this.state;

    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <AuthPage />
                </AuthRedirect>
              }
            />
            <Route path="" element={<Navigate to="/" replace />} />
            <Route
              path="/"
              element={
                <AuthRedirect>
                  <AppLayout>
                    <Welcome />
                  </AppLayout>
                </AuthRedirect>
              }
            />
            <Route
              path="/product"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfileForm />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <ProfilePage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800">
                          My Tasks
                        </h1>
                        <Button
                          onClick={() => (window.location.href = "/product")}
                          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" /> Add New Task
                        </Button>
                      </div>

                      {loading ? (
                        <div className="flex justify-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                      ) : data.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-700 mb-2">
                            No tasks found
                          </h3>
                          <p className="text-gray-500 mb-6">
                            You don't have any tasks yet. Create your first task
                            to get started.
                          </p>
                          <Button
                            onClick={() => (window.location.href = "/product")}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Create Task
                          </Button>
                        </div>
                      ) : (
                        <AnimatePresence>
                          <div className="container mx-auto px-4">
                            <motion.div
                              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              {data.map((product: object, index) => (
                                <motion.div
                                  key={product._id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{
                                    delay: index * 0.05,
                                    duration: 0.3,
                                  }}
                                  className="flex justify-center"
                                >
                                  <Card
                                    title={product.task}
                                    text={`Priority: ${product.priority}`}
                                    img={product.image}
                                    delete={() =>
                                      this.handleDeleteProduct(product._id)
                                    }
                                    edit={() => this.handleEditProduct(product)}
                                  />
                                </motion.div>
                              ))}
                            </motion.div>
                          </div>
                        </AnimatePresence>
                      )}
                    </div>

                    {editDialog && (
                      <DialogDemo
                        isOpen={true}
                        product={editingProduct}
                        onClose={() => this.setState({ editDialog: false })}
                        handleSave={() => this.submitEditProduct()}
                        onChange={(e, field) =>
                          this.handleProductChange(e, field)
                        }
                      />
                    )}
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }
}

export default App;
