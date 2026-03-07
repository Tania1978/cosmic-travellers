import Header from "./components/Header";
import AppRoutes from "./AppRoutes";
import Footer from "./components/Footer";
import { useAuth } from "./auth/authContext";
import { AppAudio } from "./components/AppAudio";


export default function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading…</div>;

  return (
    <>
      <Header />
      <AppAudio/>
      <AppRoutes />
      <Footer />
    </>
  );
}
