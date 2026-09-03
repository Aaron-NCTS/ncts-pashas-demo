import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { LanguageProvider } from './i18n/LanguageContext';
import { Toaster } from './components/ui/Toaster';

import { PublicLayout } from './layouts/PublicLayout';
import { ClientLayout } from './layouts/ClientLayout';
import { AdminLayout } from './layouts/AdminLayout';

import { Login } from './pages/public/Login';
import { Home } from './pages/public/Home';
import { Catalog } from './pages/public/Catalog';
import { ProductDetail } from './pages/public/ProductDetail';
import { Distributors } from './pages/public/Distributors';
import { Wholesale } from './pages/public/Wholesale';
import { About } from './pages/public/About';
import { Contact } from './pages/public/Contact';
import { Cart } from './pages/public/Cart';
import { Checkout } from './pages/public/Checkout';
import { OrderConfirmation } from './pages/public/OrderConfirmation';
import { OrderTrackingPublic } from './pages/public/OrderTrackingPublic';

import { ClientDashboard } from './pages/client/ClientDashboard';
import { ClientOrders } from './pages/client/ClientOrders';
import { ClientTracking } from './pages/client/ClientTracking';
import { ClientQuotes } from './pages/client/ClientQuotes';
import { ClientBilling } from './pages/client/ClientBilling';
import { ClientFavorites } from './pages/client/ClientFavorites';
import { ClientProfile } from './pages/client/ClientProfile';
import { ClientSupport } from './pages/client/ClientSupport';

import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminDistributors } from './pages/admin/AdminDistributors';
import { AdminQuotes } from './pages/admin/AdminQuotes';
import { AdminLogistics } from './pages/admin/AdminLogistics';
import { AdminSuppliers } from './pages/admin/AdminSuppliers';
import { AdminCrm } from './pages/admin/AdminCrm';
import { AdminPromotions } from './pages/admin/AdminPromotions';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminSettings } from './pages/admin/AdminSettings';

export default function App() {
  return (
    <LanguageProvider>
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Catalog />} />
            <Route path="/productos/:id" element={<ProductDetail />} />
            <Route path="/mayoreo" element={<Wholesale />} />
            <Route path="/distribuidores" element={<Distributors />} />
            <Route path="/nosotros" element={<About />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/pedido-confirmado/:id" element={<OrderConfirmation />} />
            <Route path="/seguimiento/:id" element={<OrderTrackingPublic />} />
          </Route>

          <Route path="/login" element={<Login />} />

          <Route path="/portal" element={<ClientLayout />}>
            <Route index element={<ClientDashboard />} />
            <Route path="pedidos" element={<ClientOrders />} />
            <Route path="seguimiento" element={<ClientTracking />} />
            <Route path="cotizaciones" element={<ClientQuotes />} />
            <Route path="facturacion" element={<ClientBilling />} />
            <Route path="favoritos" element={<ClientFavorites />} />
            <Route path="perfil" element={<ClientProfile />} />
            <Route path="soporte" element={<ClientSupport />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="pedidos" element={<AdminOrders />} />
            <Route path="inventario" element={<AdminInventory />} />
            <Route path="productos" element={<AdminProducts />} />
            <Route path="categorias" element={<AdminCategories />} />
            <Route path="clientes" element={<AdminCustomers />} />
            <Route path="distribuidores" element={<AdminDistributors />} />
            <Route path="cotizaciones" element={<AdminQuotes />} />
            <Route path="logistica" element={<AdminLogistics />} />
            <Route path="proveedores" element={<AdminSuppliers />} />
            <Route path="crm" element={<AdminCrm />} />
            <Route path="promociones" element={<AdminPromotions />} />
            <Route path="reportes" element={<AdminReports />} />
            <Route path="usuarios" element={<AdminUsers />} />
            <Route path="configuracion" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AppProvider>
    </LanguageProvider>
  );
}
