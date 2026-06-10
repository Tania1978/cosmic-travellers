import styled from "styled-components";

type VideoLoaderProps = {
  src?: string;
};

export function OtherVideo({ src = "/ui/magic-loader.mp4" }: VideoLoaderProps) {
  return (
    <VideoLoader>
      <LoaderVideo autoPlay muted loop playsInline>
        <source src={src} type="video/mp4" />
      </LoaderVideo>
    </VideoLoader>
  );
}

const VideoLoader = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoaderVideo = styled.video`
  width: 100%;
  height: auto;
`;
