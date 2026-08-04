import { useContext } from "react";
import { DataContext } from "../context/DataContext";

export const useData = () => {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error("useData doit être utilisé à l’intérieur de DataProvider");
  }

  return context;
};
