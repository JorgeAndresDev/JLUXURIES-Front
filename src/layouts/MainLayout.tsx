import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  const location = useLocation();
  const hideNavAndFooterRoutes = ['/login', '/register'];
  const shouldShowNavAndFooter = !hideNavAndFooterRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black text-gray-900 dark:text-white transition-colors duration-300">
      {shouldShowNavAndFooter && <Navbar />}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>
      {shouldShowNavAndFooter && <Footer />}
    </div>
  );
};

export default MainLayout;