// @ts-nocheck
import React from "react";
import { ProfileForm } from "./form.tsx";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Card from "./card.tsx";
import { useProductStore } from "./store/product.ts";
import { DialogDemo } from "./dialog.tsx";
import { Button } from "@/components/ui/button";
import "./App.css";
import { toast } from "@/hooks/use-toast";
import StackIcon from "tech-stack-icons";
import { FaCode } from "react-icons/fa6";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

function Wellcome() {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle the button click and navigate to /super
  const handleClick = () => {
    navigate("/super"); // Navigate to /super route
  };

  return (
    <>
      <div className="flex gap-4 items-center justify-center flex-wrap flex-col">
        <div className="flex gap-4">
          <h1>Wellcome</h1>
          {/* Button that triggers the navigation */}
          <Button onClick={handleClick}>Click to View</Button>
        </div>
        <h3 className="mt-5">
          <FaCode />
        </h3>

        <div className="flex gap-2">
          <div className="size-7">
            <StackIcon name="reactjs" />
          </div>
          <div className="size-7">
            <StackIcon name="js" />
          </div>
          <div className="size-7">
            <StackIcon name="typescript" />
          </div>
          <div className="size-7">
            <StackIcon name="mongoose" />
          </div>
          <div className="size-7">
            <StackIcon name="mongodb" />
          </div>
          <div className="size-7">
            <StackIcon name="nodejs" />
          </div>
          <div className="size-7">
            <StackIcon name="postman" />
          </div>
        </div>
      </div>
    </>
  );
}

function AlertBox(props: object) {
  return (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle className="flex object-cover">Heads up! </AlertTitle>
      <AlertDescription className="flex items-center">
        {props.msg}
        <img className="w-20 h-15 object-cover self-end" src="cat.gif"></img>
      </AlertDescription>
    </Alert>
  );
}

class App extends React.Component {
  constructor(props: object) {
    super(props);
    this.state = {
      data: [],
    };
    this.handleDeleteProduct = this.handleDeleteProduct.bind(this);
    this.handleEditProduct = this.handleEditProduct.bind(this);
    this.submitEditProduct = this.submitEditProduct.bind(this);
  }

  async componentDidMount(): void {
    await useProductStore.getState().fetchProducts();
    const products = useProductStore.getState().products;
    console.log(products);
    this.setState({
      data: products,
      editDialog: false,
      editingProduct: null,
    });
  }
  async componentDidUpdate(): void {
    await useProductStore.getState().fetchProducts();
    console.log(useProductStore.getState().products);
  }

  async handleDeleteProduct(pid: object) {
    const { deleteProduct } = useProductStore.getState();
    const { success, message } = await deleteProduct(pid);
    console.log(success, message);
    if (success) {
      this.setState((prevState) => ({
        data: prevState.data.filter((product: object) => product._id !== pid),
      }));

      toast({
        title: "Task Deleted!",
        description: "Less Stress, Happier life!",
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
        product._id == editingProduct._id ? editingProduct : product
      );

      this.setState({
        data: updatedData,
        editDialog: false,
        editingProduct: null,
      });

      toast({
        title: "Task Updated",
        description: "Changes have been saved successfully!",
      });
    } else {
      toast({
        title: "Woops!, An error occured",
        description: "Something wrong with the server",
      });
    }
  }

  handleProductChange(e, field) {
    const { value } = e.target;
    this.setState((prevState) => ({
      editingProduct: {
        ...prevState.editingProduct,
        [field]: field === "price" ? parseFloat(value) : value, // Ensure price is stored as a Number
      },
    }));

    console.log(this.state.editingProduct);
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <SidebarProvider>
            <AppSidebar />
            <main>
              <SidebarTrigger />
              {}
            </main>

            <div className="canvas w-full flex items-center justify-center">
              <div className="form-container w-4/5 p-2 ">
                {" "}
                <Routes>
                  <Route path="" element={<Wellcome />} />
                  <Route path="/product" element={<ProfileForm />} />
                  <Route
                    path="/user"
                    element={
                      <AlertBox msg="Our programmer hasn't programmed it yet." />
                    }
                  />
                  <Route
                    path="/super"
                    element={
                      <>
                        <div className="flex justify-center items-center pl-7">
                          <div className="card-list flex gap-8 flex-wrap items-start justify-start">
                            {this.state.data.map((product: object) => (
                              <Card
                                key={product._id}
                                title={product.name}
                                text={`Priority: ${product.price}`}
                                img={product.image}
                                delete={() =>
                                  this.handleDeleteProduct(product._id)
                                }
                                edit={() => this.handleEditProduct(product)} // Pass the entire product
                              />
                            ))}
                          </div>
                        </div>
                      </>
                    }
                  />
                </Routes>
              </div>
            </div>
            {this.state.editDialog && (
              <DialogDemo
                isOpen={true}
                product={this.state.editingProduct}
                onClose={() => this.setState({ editDialog: false })} // Close dialog handler
                handleSave={() => this.submitEditProduct()}
                onChange={(e, field) => this.handleProductChange(e, field)}
              />
            )}
          </SidebarProvider>
        </BrowserRouter>
      </>
    );
  }
}

export default App;
