import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { ImageButton } from "../theme/styled";
import LanguageSelect from "./LanguageSelect";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const inHomePage = location.pathname === "/";

  const [language, setLanguage] = React.useState("en");
  const [menuOpen, setMenuOpen] = React.useState(false);

  const closeMenu = () => setMenuOpen(false);

  // Close menu on route change
  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Escape to close
  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <Bar>
        <Left>
          {!inHomePage && (
            <ImageButton
              type="button"
              onClick={() => navigate("/")}
              aria-label="Back to bookshelf"
            >
              <img src="/ui/back-home.png" alt="Back" />
            </ImageButton>
          )}

          {/* Desktop-only left item (Writer Notes badge) */}
          {inHomePage && (
            <DesktopOnly>
              <ImageButton
                $width="240px"
                type="button"
                $responsive
                onClick={() => navigate("/writer-notes")}
                aria-label="Open writer notes"
              >
                <img src="/ui/writer-notes-2.png" alt="Writer Notes" />
              </ImageButton>
            </DesktopOnly>
          )}
        </Left>

        <Right>
          {/* Desktop-only language selector */}
          <DesktopOnly>
            <LanguageSelect
              value={language}
              onChange={(lang) => setLanguage(lang)}
            />
          </DesktopOnly>

          {/* Mobile hamburger */}
          <MobileOnly>
            <HamburgerButton
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="header-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </HamburgerButton>
          </MobileOnly>
        </Right>
      </Bar>

      {/* Mobile drawer menu */}
      <DrawerOverlay
        $open={menuOpen}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />

      <Drawer id="header-menu" $open={menuOpen} role="dialog" aria-modal="true">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <CloseButton
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            ✕
          </CloseButton>
        </DrawerHeader>

        <DrawerContent>
          {/* Add menu items here (scales as you add more) */}
          <MenuItemButton
            type="button"
            onClick={() => {
              navigate("/");
              closeMenu();
            }}
          >
            Bookshelf
          </MenuItemButton>

          <MenuItemButton
            type="button"
            onClick={() => {
              navigate("/writer-notes");
              closeMenu();
            }}
          >
            Writer Notes
          </MenuItemButton>

          <MenuItemButton
            type="button"
            onClick={() => {
              navigate("/art-credits");
              closeMenu();
            }}
          >
            Art & Visual Credits
          </MenuItemButton>

          <Divider />

          <MenuSectionTitle>Language</MenuSectionTitle>
          <LanguageRow>
            <LanguageSelect
              value={language}
              onChange={(lang) => setLanguage(lang)}
            />
          </LanguageRow>
        </DrawerContent>
      </Drawer>
    </>
  );
}

/* ---------------- styles ---------------- */

const Bar = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  padding: 0 24px;
  z-index: 50;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: rgba(255, 255, 255, 0.13);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border-bottom: 1px solid rgba(255, 255, 255, 0.4);

  @media (max-width: 700px) {
    padding: 0 14px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const DesktopOnly = styled.div`
  display: block;

  @media (max-width: 700px) {
    display: none;
  }
`;

const MobileOnly = styled.div`
  display: none;

  @media (max-width: 700px) {
    display: block;
  }
`;

const HamburgerButton = styled.button`
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;

  display: grid;
  align-content: center;
  justify-items: center;
  gap: 5px;

  span {
    width: 18px;
    height: 2px;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 99px;
    display: block;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const DrawerOverlay = styled.div<{ $open: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 60;
  background: rgba(0, 0, 0, 0.35);
  opacity: ${({ $open }) => ($open ? 1 : 0)};
  pointer-events: ${({ $open }) => ($open ? "auto" : "none")};
  transition: opacity 180ms ease;
`;

const Drawer = styled.aside<{ $open: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  width: min(320px, 88vw);
  z-index: 70;

  background: rgba(18, 26, 48, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  border-left: 1px solid rgba(255, 255, 255, 0.18);

  transform: ${({ $open }) => ($open ? "translateX(0)" : "translateX(105%)")};
  transition: transform 220ms ease;
`;

const DrawerHeader = styled.div`
  height: 70px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
`;

const DrawerTitle = styled.div`
  font-weight: 800;
  letter-spacing: 0.4px;
  color: rgba(255, 255, 255, 0.92);
`;

const CloseButton = styled.button`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.18);
  }
`;

const DrawerContent = styled.div`
  padding: 14px 16px;
  display: grid;
  gap: 12px;
`;

const MenuItemButton = styled.button`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.92);

  padding: 12px 12px;
  border-radius: 14px;
  cursor: pointer;

  text-align: left;
  font-weight: 700;
  letter-spacing: 0.2px;

  &:hover {
    background: rgba(255, 255, 255, 0.16);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.14);
  margin: 6px 0;
`;

const MenuSectionTitle = styled.div`
  font-size: 0.75rem;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
`;

const LanguageRow = styled.div`
  width: 100%;
`;
