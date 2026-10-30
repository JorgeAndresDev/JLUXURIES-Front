import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const MainLayout = () => {
  const location = useLocation();
  const hideNavAndFooterRoutes = ['/login', '/register'];
  const shouldShowNavAndFooter = !hideNavAndFooterRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col">
      {shouldShowNavAndFooter && <Navbar />}
      <main className="flex flex-grow flex-col">
        <Outlet />
      </main>
      {shouldShowNavAndFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
