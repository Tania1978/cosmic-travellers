import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import { useAuth } from "./auth/authContext";
import Header from "./components/Header";

export default function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading…</div>;
  console.log("App.tsx");

  return (
    <>
      <Header />
      <AppRoutes />
      <Footer />
    </>
  );
}
