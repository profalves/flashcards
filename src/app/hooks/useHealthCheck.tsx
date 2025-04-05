import { useState, useEffect } from "react";

/**
 * Hook that performs a health check to verify API connectivity when the application loads
 * @returns Object containing the health check status and any error message
 */
const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const response = await fetch(`${apiUrl}`);
      if (!response.ok) {
        throw new Error(`Health check failed with status: ${response.status}`);
      }

      setIsHealthy(true);
      setError(null);
    } catch (err) {
      setIsHealthy(false);
      setError(
        err instanceof Error ? err.message : "Failed to connect to the service"
      );
      console.error("Health check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return { isHealthy, error, loading };
};

export default useHealthCheck;
