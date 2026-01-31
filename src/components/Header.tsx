import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import React from "react";
import { ImageButton } from "../theme/styled";
import LanguageSelect from "./LanguageSelect";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if we are inside a book route (/:bookSlug/:page)
  const inBook =
    location.pathname.split("/").length > 2 ||
    location.pathname === "/writer-notes";

  const inHomePage = location.pathname === "/";

  const [language, setLanguage] = React.useState("en");

  return (
    <Bar>
      <Left>
        {inBook && (
          <ImageButton
            type="button"
            onClick={() => {
              console.log("clicked");
              navigate("/");
            }}
            aria-label="Back to bookshelf"
          >
            <img src="/ui/back-home.png" alt="Back" />
          </ImageButton>
        )}
        {inHomePage && (
          <ImageButton
            $width="240px"
            type="button"
            onClick={() => navigate("/writer-notes")}
            aria-label="Back to bookshelf"
          >
            <img src="/ui/writer-notes-2.png" alt="Back" />
          </ImageButton>
        )}
      </Left>

      <Right>
        <LanguageSelect
          value={language}
          onChange={(lang) => setLanguage(lang)}
        />
      </Right>
    </Bar>
  );
}

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
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 100px;
`;
