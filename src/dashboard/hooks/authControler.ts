// hooks/useUserData.ts
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider"; 
import { jwtDecode } from "jwt-decode";

type TokenPayload = {
  sub: string;
  username?: string;
  email?: string;
  [key: string]: any;
};

export default function useUserData() {
  const { token } = useAuth();
  const [userData, setUserData] = useState<TokenPayload | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setUserData(decoded);
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, [token]);

  return userData;
}
