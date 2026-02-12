import styled from "styled-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <Wrap>
      <Inner>
        <Line>
          © {new Date().getFullYear()} {t("title.series")}
        </Line>

        <Links>
          <StyledLink to="/art-credits">{t("credits.artVisual")}</StyledLink>
          <Dot>·</Dot>
          <StyledLink to="/writer-notes">{t("credits.writerNote")}</StyledLink>
        </Links>
      </Inner>
    </Wrap>
  );
}
const Wrap = styled.footer`
  margin-top: 80px;
  padding: 40px 20px;
  text-align: center;

  background: linear-gradient(
    to top,
    rgba(10, 18, 40, 0.85),
    rgba(10, 18, 40, 0.55)
  );

  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  border-top: 1px solid rgba(255, 255, 255, 0.15);
`;

const Inner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  gap: 12px;
`;

const Line = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.4px;
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const StyledLink = styled(Link)`
  font-size: 0.875rem;
  color: rgba(180, 220, 255, 0.9);
  text-decoration: none;
  font-weight: 600;
  letter-spacing: 0.3px;

  &:hover {
    text-decoration: underline;
  }
`;

const Dot = styled.span`
  color: rgba(255, 255, 255, 0.4);
`;
