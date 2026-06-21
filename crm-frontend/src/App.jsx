import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LeadsPage } from "./pages/LeadsPage";

function App() {
  return (
    <BrowserRouter>
      {/*
        Toaster fica fora das Routes, registrado uma única vez na raiz.
        É ele que renderiza visualmente os toasts disparados pelo
        interceptor de erro do axiosInstance (DEC-002).
      */}
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<LeadsPage />} />
        <Route path="/leads" element={<LeadsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;