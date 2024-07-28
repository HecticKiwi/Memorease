import Navbar from "@/components/navbar";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ReactQueryClientProvider from "@/components/providers/reactQueryClientProvider";

async function MainLayout({ children }: { children: ReactNode }) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <ReactQueryClientProvider>
        <TooltipProvider>
          <Navbar />
          {children}
          <Toaster />
        </TooltipProvider>
      </ReactQueryClientProvider>
    </>
  );
}

export default MainLayout;
