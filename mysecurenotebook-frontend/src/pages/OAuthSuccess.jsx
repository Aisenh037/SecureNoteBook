import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginSuccess } = useAuth();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      loginSuccess(token);
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [params, loginSuccess, navigate]);

  return <div className="p-6">Signing you in…</div>;
}
