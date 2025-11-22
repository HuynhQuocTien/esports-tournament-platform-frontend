import { Routes, Route } from "react-router-dom";
import { PublicRouter } from "./PublicRouter";
import { AdminRouter } from "./AdminRouter";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/*" element={<PublicRouter />} />
      
      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
  );
};