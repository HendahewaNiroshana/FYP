import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Products from "./pages/Products";
import Advertisement from "./pages/Advertisement";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AddAdvertisement from "./pages/AddAdvertisement";  
import Chatbot from "./pages/Chatbot"
import ManageProducts from "./pages/ManageProducts";
import ProductDetails from "./pages/ProductDetails";
import PlaceOrder from "./pages/PlaceOrder";
import EditUser from "./pages/EditUser";
import EditAdvertisement from "./pages/EditAdvertisement";
import ViewAdvertisement from "./pages/ViewAdvertisement";
import Notifications from "./pages/Notifications";
import BusinessTools from "./pages/businesstools";
import SellerDashboard from "./pages/SalesDashboard";
import OverallSales from "./pages/OverallSales";
import SallerOrder from "./pages/OrderManagement";
import AddReport from "./pages/AddReport";
import MyOrders from "./pages/MyOrders";
import SalesReport from "./pages/SalesReport";
import CinnamonClassifier from "./components/CinnamonClassifier";
import PasswordReset from "./pages/PasswordReset";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/products" element={<Products />} />
          <Route path="/advertisement" element={<Advertisement />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/add-advertisement" element={<AddAdvertisement />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/manage-products" element={<ManageProducts />} />
          <Route path="/productsdetails/:id" element={<ProductDetails />} />
          <Route path="/placeorder/:id" element={<PlaceOrder />} />
          <Route path="/edit-profile" element={<EditUser />} />
          <Route path="/edit-advertisement/:id" element={<EditAdvertisement />} />
          <Route path="/view-advertisement/:id" element={<ViewAdvertisement />} />
          <Route path="/notification" element={<Notifications />} />
          <Route path="/businesstool" element={<BusinessTools />} />
          <Route path="/predictanalitics" element={<SellerDashboard />} />
          <Route path="/overallsaleprediction" element={<OverallSales />} />
          <Route path="/sallerordermanagement" element={<SallerOrder />} />
          <Route path="/addreport" element={<AddReport />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/salereport" element={<SalesReport />} />
          <Route path="/cinnamonclassifier" element={<CinnamonClassifier />} />
          <Route path="/reset-password" element={<PasswordReset />} />

        </Routes>
      </div>
    </Router>
  );
}
