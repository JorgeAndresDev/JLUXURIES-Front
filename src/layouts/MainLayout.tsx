import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  const location = useLocation();
  const hideNavAndFooterRoutes = ['/login', '/register'];
  const shouldShowNavAndFooter = !hideNavAndFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      {shouldShowNavAndFooter && <Navbar />}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      {shouldShowNavAndFooter && <Footer />}
    </div>
  );
};

export default MainLayout;