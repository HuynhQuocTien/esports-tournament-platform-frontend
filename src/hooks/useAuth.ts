import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../common/interfaces/payload/jwt-payload";
export function useAuth() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          setRole(decoded.role);
        } else {
          localStorage.removeItem("access_token");
        }
      } catch {
        localStorage.removeItem("access_token");
      }
    }

  }, []);

  return { user, setUser,role, setRole };
}
