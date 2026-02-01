import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <GoogleOAuthProvider clientId="237329461942-dh4hvkp24trmet9lgqkcoove5k8upkl7.apps.googleusercontent.com">
        <AppWrapper>
          <App />
        </AppWrapper>
      </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
