import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function DatabaseToggle() {
  const [isSequelize, setIsSequelize] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current database type on component mount
  useEffect(() => {
    fetchDatabaseType();
  }, []);

  // Fetch the current database type from the backend
  const fetchDatabaseType = async () => {
    try {
      const response = await fetch("http://localhost:7777/api/system/db-type");
      const data = await response.json();

      if (data.success) {
        setIsSequelize(data.data.type === "sequelize");
      }
    } catch (error) {
      console.error("Error fetching database type:", error);
    }
  };

  // Toggle the database type
  const handleToggle = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:7777/api/system/toggle-db",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify({ useSequelize: !isSequelize }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsSequelize(!isSequelize);
        toast({
          title: "Database Changed",
          description: `Switched to ${
            !isSequelize ? "Sequelize" : "MongoDB"
          } successfully. The server will restart.`,
        });

        // Wait for server to restart
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to toggle database",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error toggling database:", error);
      toast({
        title: "Error",
        description:
          "Failed to toggle database. The server might be restarting.",
        variant: "destructive",
      });

      // Try to reconnect after a delay
      setTimeout(() => {
        fetchDatabaseType();
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Database:{" "}
            <span className="font-bold">
              {isSequelize ? "Sequelize (SQL)" : "MongoDB (NoSQL)"}
            </span>
          </span>

          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isSequelize
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isSequelize ? "SQL" : "NoSQL"}
          </span>
        </div>

        <Button
          onClick={handleToggle}
          disabled={isLoading}
          variant={isSequelize ? "outline" : "default"}
          className="w-full"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Switching database...
            </span>
          ) : (
            <>Switch to {isSequelize ? "MongoDB" : "Sequelize"}</>
          )}
        </Button>
      </div>
    </div>
  );
}
