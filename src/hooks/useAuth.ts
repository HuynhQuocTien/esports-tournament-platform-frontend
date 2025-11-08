import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../common/types";

export function useAuth() {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("refresh_token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem("refresh_token");
        }
      } catch {
        localStorage.removeItem("refresh_token");
      }
    }
  }, []);

  return { user, setUser };
}
