import Header from "./components/Header";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import { useAuth } from "./auth/authContext";

export default function App() {
  const { loading} = useAuth();

  if (loading) return <div>Loading…</div>;

  return (
    <>
      <Header />
      <AppRoutes />
      <Footer />
    </>
  );
}
