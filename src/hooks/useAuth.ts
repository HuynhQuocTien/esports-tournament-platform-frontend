// frontend/src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../common/interfaces/payload/jwt-payload";

export function useAuth() {
  const [user, setUser] = useState<JwtPayload | null>();

  // Function để load user từ token
  const loadUserFromToken = () => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          return decoded;
        } else {
          localStorage.removeItem("access_token");
          setUser(null);
        }
      } catch {
        localStorage.removeItem("access_token");
        setUser(null);
      }
    } else {
      setUser(null);
    }
    return null;
  };

  useEffect(() => {
    loadUserFromToken();
  }, []);

  return { user, setUser, refetchUser: loadUserFromToken };
}