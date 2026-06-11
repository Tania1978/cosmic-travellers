import { useTranslation } from "react-i18next";
import { Trigger } from "../theme/sharedStyled";
import { useAuth } from "./authContext";
import { clearShellsStore } from "../GoldenShells/storage";

export default function ParentLoginButton() {
  const { setAuthModalOpen, isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();

  const handleLogOut = () => {
    clearShellsStore();
    logout();
  };

  return (
    <Trigger
      onClick={() => (!isLoggedIn ? setAuthModalOpen(true) : handleLogOut())}
    >
      {isLoggedIn ? t("auth.parents.signOut") : t("auth.parents.signIn")}
    </Trigger>
  );
}
