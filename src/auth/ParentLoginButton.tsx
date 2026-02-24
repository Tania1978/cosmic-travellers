import { useTranslation } from "react-i18next";
import { Trigger } from "../theme/sharedStyled";
import { useAuth } from "./authContext";

export default function ParentLoginButton() {
  const { setAuthModalOpen, isLoggedIn, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <Trigger onClick={() => (!isLoggedIn ? setAuthModalOpen(true) : logout())}>
      {isLoggedIn ? t("auth.parents.signOut") : t("auth.parents.signIn")}
    </Trigger>
  );
}
