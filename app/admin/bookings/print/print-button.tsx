"use client";

import { Printer, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function PrintButton() {
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium shadow-lg hover:bg-gray-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <button
        onClick={() => window.print()}
        className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-gray-800"
      >
        <Printer className="h-4 w-4" />
        Print
      </button>
    </>
  );
}
