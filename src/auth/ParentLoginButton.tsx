import { Trigger } from "../theme/sharedStyled";
import { useAuth } from "./authContext";

export default function ParentLoginButton() {
  const { setAuthModalOpen, isLoggedIn, logout } = useAuth();

  return (
    <Trigger onClick={() => (!isLoggedIn ? setAuthModalOpen(true) : logout())}>
      {isLoggedIn ? "Parents: Sign Out" : "Parents: Sign In"}
    </Trigger>
  );
}
