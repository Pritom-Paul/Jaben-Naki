import { ThemeProvider } from "./components/theme-provider";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="jaben_naki-theme">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* 🔐 Protected Route */}
          <Route element={<ProtectedRoutes />}>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster/>
    </ThemeProvider>
  );
}

export default App;
