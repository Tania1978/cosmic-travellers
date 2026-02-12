import Header from "./components/Header";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import { useAuth } from "./auth/authContext";

export default function App() {
  const { loading, isLoggedIn } = useAuth();

  if (loading) return <div>Loading…</div>;
  console.log(loading, isLoggedIn);

  return (
    <>
      <Header />
      <AppRoutes />
      <Footer />
    </>
  );
}
