import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Archive from "./pages/Archive";
import Authority from "./pages/Authority";
import Learn from "./pages/Learn";
import Results from "./pages/Results";
import Explain from "./pages/Explain";
import NotFound from "./pages/NotFound";
import ImageResults from "./pages/ImageResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/authority" element={<Authority />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/results" element={<Results />} />
          <Route path="/explain" element={<Explain />} />
          <Route path="/image-results" element={<ImageResults />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
