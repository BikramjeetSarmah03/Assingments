import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import FullScreenLoader from "@/components/layout/full-screen-loader";

export default function Protected() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setIsAuth, isAuth } = useAuth();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        setLoading(true);

        const res = await api.get("/auth/verify");

        if (!res.data.success) {
          navigate("/auth/sign-in", { replace: true });
          setIsAuth(false, null);
        }

        setIsAuth(true, res.data.user);
      } catch (error) {
        navigate("/auth/sign-in", { replace: true });
        setIsAuth(false, null);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuth) {
      verifyUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth, navigate]);

  return loading ? <FullScreenLoader /> : <Outlet />;
}
