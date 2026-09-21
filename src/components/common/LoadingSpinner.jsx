import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ message = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <Loader2 className={`${sizeClasses[size] || sizeClasses.md} animate-spin text-emerald-400`} />
      {message && <p className="text-sm text-slate-400 font-medium">{message}</p>}
    </div>
  );
};
