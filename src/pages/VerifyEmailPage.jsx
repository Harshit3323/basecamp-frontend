import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmailApi } from "../api/auth.api";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await verifyEmailApi(token);
        setStatus("success");
        setMessage(res.message || "Your email address has been verified successfully!");
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Invalid or expired verification token.");
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus("error");
      setMessage("Verification token is missing.");
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="bg-slate-900/80 backdrop-blur-xl p-8 max-w-md w-full rounded-2xl border border-slate-800 text-center shadow-2xl z-10">
        {status === "verifying" && (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Verifying Email...</h2>
            <p className="text-xs text-slate-400">Please wait while we confirm your verification link.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-xs text-slate-300 mb-6">{message}</p>
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-lg shadow-emerald-500/20"
            >
              <span>Continue to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-xs text-rose-300 mb-6">{message}</p>
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 transition-all"
            >
              <span>Back to Sign In</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
