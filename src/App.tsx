import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as HotToaster } from 'react-hot-toast'
import { BookingProvider } from './context/BookingContext'
import Index from "./pages/Index.tsx";
import Fleet from "./pages/Fleet.tsx";
import ConfirmBooking from "./pages/ConfirmBooking.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BookingProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HotToaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F1E1C',
              color: '#F0FFF8',
              border: '1px solid rgba(64,138,113,0.20)',
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#B0E4CC',
                secondary: '#0e1111',
              },
            },
            error: {
              iconTheme: {
                primary: '#BA1A1A',
                secondary: '#0F1E1C',
              },
            },
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/fleet" element={<Fleet />} />
            <Route path="/confirm" element={<ConfirmBooking />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </BookingProvider>
  </QueryClientProvider>
);

export default App;
