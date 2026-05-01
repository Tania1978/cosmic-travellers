import AppRoutes from "./AppRoutes";

import { useAuth } from "./auth/authContext";


export default function App() {
  const { loading } = useAuth();

  if (loading) return <div>Loading…</div>;


  return (
    <>
      <AppRoutes />
    </>
  );
}
