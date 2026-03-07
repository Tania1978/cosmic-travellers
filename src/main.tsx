import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import ScrollToTop from "./components/ScrollToTop.tsx";
import "./data/i18n/i18n.ts";
import "./theme/fonts.css";
import { AuthProvider } from "./auth/authContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserStateProvider } from "./contexts/userContext.tsx";
import { SoundProvider } from "./contexts/soundContext.tsx";
import { AppAudio } from "./components/AppAudio.tsx";
import { SoundControls } from "./components/SoundControls.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ThemeProvider theme={theme}>
            <UserStateProvider>
              <SoundProvider>
                <AppAudio />
                <SoundControls />
                <App />
              </SoundProvider>
            </UserStateProvider>
          </ThemeProvider>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
