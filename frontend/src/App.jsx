// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Landing/Home.jsx";
import Login from "./Components/Auth/Login.jsx";
import Register from "./Components/Auth/Register.jsx";
import Account from "./Components/Account/Account.jsx";
import RequireAuth from "./Routes/RequireAuth.jsx";
import Etranger from "./Components/Services/Etranger.jsx";
import SejourHotel from "./Components/Services/SejourHotel.jsx";
import Excursions from "./Components/Services/Excursions.jsx";
import Payment from "./Components/Payment/Payment.jsx";
import ContactSection from "./Components/Contact/ContactSection.jsx";
import NotFound from "./Components/Common/NotFound.jsx";
import Contactinfo from "./Components/Contact/ContactInfo.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* services */}
        <Route path="/etranger" element={<Etranger />} />
        <Route path="/sejours" element={<SejourHotel />} />
        <Route path="/excursions" element={<Excursions />} />

        {/* contact */}
        <Route path="/contact" element={<ContactSection />} />
        <Route path="/contactinfo" element={<Contactinfo/>}/>


        {/* authentication */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />

        {/* compte prottégé */}
        <Route element={<RequireAuth />}>
          <Route path="/compte" element={<Account />} />
        </Route>

        {/* paaiement */}
        <Route path="/paiement" element={<Payment />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}
