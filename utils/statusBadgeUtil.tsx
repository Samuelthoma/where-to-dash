export const getStatusBadge = (status?: string) => {
    if (!status) return "bg-slate-100 text-slate-800 border-slate-200";

    switch (status.toLowerCase()) {
      case "queued":
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "processing":
      case "scraping":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "failed":
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      case "done":
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };