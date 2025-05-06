// @ts-nocheck
import React from "react";
import { ProfileForm } from "./form.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle2, Plus, ClipboardList } from "lucide-react";
import Card from "./card.tsx";
import { useProductStore } from "./store/product.ts";
import { DialogDemo } from "./dialog.tsx";
import { Button } from "@/components/ui/button";
import "./App.css";
import { toast } from "@/hooks/use-toast";
import StackIcon from "tech-stack-icons";
import { FaCode } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { AuthPage } from "./login.tsx";
import { ProfilePage } from "./profile.tsx";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function Welcome() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/tasks");
  };

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
        className="mb-10 flex gap-4 flex-wrap"
      >
        <Button
          onClick={handleClick}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-xl flex items-center gap-2 text-lg"
        >
          <ClipboardList className="h-5 w-5" /> View My Tasks
        </Button>

        <Button
          onClick={() => navigate("/login")}
          size="lg"
          variant="outline"
          className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-xl flex items-center gap-2 text-lg"
        >
          Login / Register
        </Button>

        <a
          href="http://localhost:7777/api-docs/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-green-600 text-green-600 hover:bg-green-50 rounded-md transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
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

      <motion.div variants={itemVariants} className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
          <FaCode className="text-blue-600" /> Built with modern technologies
        </h3>

        <div className="flex gap-4 justify-center flex-wrap">
          {[
            "reactjs",
            "js",
            "typescript",
            "mongoose",
            "mongodb",
            "nodejs",
            "postman",
          ].map((tech) => (
            <motion.div
              key={tech}
              whileHover={{ y: -5 }}
              className="size-10 bg-white p-1.5 rounded-lg shadow-md"
            >
              <StackIcon name={tech} />
            </motion.div>
          ))}
        </div>
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

function AlertBox(props: object) {
  return (
    <Alert className="max-w-md mx-auto mt-8 border border-amber-200 bg-amber-50">
      <Terminal className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800">Heads up!</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span className="text-amber-700">{props.msg}</span>
        <img
          className="w-20 h-15 object-cover"
          src="cat.gif"
          alt="Cat animation"
        />
      </AlertDescription>
    </Alert>
  );
}

class App extends React.Component {
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
  }

  async componentDidMount(): void {
    try {
      await useProductStore.getState().fetchProducts();
      const products = useProductStore.getState().products;
      this.setState({
        data: products,
        loading: false,
      });
    } catch (error) {
      this.setState({ loading: false });
      toast({
        title: "Error loading tasks",
        description: "Could not load your tasks. Please try again.",
        variant: "destructive",
      });
    }
  }

  async handleDeleteProduct(pid: object) {
    const { deleteProduct } = useProductStore.getState();
    const { success, message } = await deleteProduct(pid);

    if (success) {
      this.setState((prevState) => ({
        data: prevState.data.filter((product: object) => product._id !== pid),
      }));

      toast({
        title: "Task Deleted",
        description: "Your task has been successfully removed.",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } else {
      toast({
        title: "Deletion Failed",
        description: message || "There was an error deleting your task.",
        variant: "destructive",
      });
    }
  }

  handleEditProduct(product) {
    this.setState({
      editDialog: true,
      editingProduct: product,
    });
  }

  async submitEditProduct() {
    const { updateProduct } = useProductStore.getState();
    const { editingProduct, data } = this.state;
    const { success, message } = await updateProduct(
      editingProduct._id,
      editingProduct
    );

    if (success) {
      const updatedData = data.map((product) =>
        product._id === editingProduct._id ? editingProduct : product
      );

      this.setState({
        data: updatedData,
        editDialog: false,
        editingProduct: null,
      });

      toast({
        title: "Task Updated",
        description: "Your changes have been saved successfully!",
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
      });
    } else {
      toast({
        title: "Update Failed",
        description: "There was an error updating your task.",
        variant: "destructive",
      });
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
          <SidebarProvider>
            <AppSidebar />
            <main className="min-h-screen bg-gray-50">
              <div className="fixed top-4 left-4 z-50 md:hidden">
                <SidebarTrigger className="bg-white/80 backdrop-blur-sm shadow-sm border border-gray-200 rounded-md" />
              </div>

              <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="flex h-14 items-center gap-4 px-4 sm:px-6 lg:px-8">
                  <SidebarTrigger className="hidden md:flex" />
                  <div className="flex-1"></div>
                </div>
              </header>

              <div className="pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Routes>
                  <Route path="" element={<Welcome />} />
                  <Route path="/login" element={<AuthPage />} />
                  <Route
                    path="/product"
                    element={
                      <ProtectedRoute>
                        <ProfileForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/user"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/tasks"
                    element={
                      <ProtectedRoute>
                        <div className="space-y-8">
                          <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">
                              My Tasks
                            </h1>
                            <Button
                              onClick={() =>
                                (window.location.href = "/product")
                              }
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
                                You don't have any tasks yet. Create your first
                                task to get started.
                              </p>
                              <Button
                                onClick={() =>
                                  (window.location.href = "/product")
                                }
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
                                        edit={() =>
                                          this.handleEditProduct(product)
                                        }
                                      />
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </div>
                            </AnimatePresence>
                          )}
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </div>

              {editDialog && (
                <DialogDemo
                  isOpen={true}
                  product={editingProduct}
                  onClose={() => this.setState({ editDialog: false })}
                  handleSave={() => this.submitEditProduct()}
                  onChange={(e, field) => this.handleProductChange(e, field)}
                />
              )}
            </main>
          </SidebarProvider>
        </BrowserRouter>
      </AuthProvider>
    );
  }
}

export default App;
