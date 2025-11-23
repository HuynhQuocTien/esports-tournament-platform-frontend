import { Routes, Route } from "react-router-dom";
import { PublicRouter } from "./PublicRouter";
import { AdminRouter } from "./AdminRouter";
import LoginPage from "@/pages/auth/LoginPage";

export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/*" element={<PublicRouter />} />

      <Route path="/admin/*" element={<AdminRouter />} />
    </Routes>
  );
};
