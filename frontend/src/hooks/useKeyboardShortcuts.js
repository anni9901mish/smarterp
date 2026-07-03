import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "d") {
        navigate("/dashboard");
      }

      if (e.altKey && e.key.toLowerCase() === "c") {
        navigate("/company");
      }

      if (e.altKey && e.key.toLowerCase() === "l") {
        navigate("/ledger");
      }

      if (e.altKey && e.key.toLowerCase() === "i") {
        navigate("/items");
      }

      if (e.altKey && e.key.toLowerCase() === "p") {
        navigate("/purchase");
      }

      if (e.altKey && e.key.toLowerCase() === "s") {
        navigate("/sales");
      }

      if (e.altKey && e.key.toLowerCase() === "r") {
        navigate("/reports");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
};

export default useKeyboardShortcuts;