import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import SmoothScroll from "./components/SmoothScroll";
import Loader from "./components/Loader";

const App = () => {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    <>
      <Loader />
      <SmoothScroll>
    <div className="min-h-screen bg-cream text-coffee overflow-x-hidden">
      {!isAdminPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdminPage && <Checkout />}
    </div>
      </SmoothScroll>
    </>
  );
};

export default App;
