import { useEffect, useState } from "react";
import styled from "styled-components";
import PageBackground from "../components/PageBackground";
import ReviewForm from "../components/ReviewForm";
import { getReviews, type Review } from "../requests";
import { reviewQuestionLabels } from "../data/books/reviewQuestions";
import { useAuth } from "../auth/authContext";

export function ReviewsPage() {
  const [formOpen, setFormOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [openReviewId, setOpenReviewId] = useState<string | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const loadReviews = async () => {
      const data = await getReviews();
      setReviews(data);
    };

    loadReviews();
  }, []);

  return (
    <Page>
      <PageBackground src="/ui/bg5.jpg" overlay />
      <Content>
        <HeaderSection>
          <Title>Reviews</Title>

          {isLoggedIn && (
            <>
              <Subtitle>
                Share your thoughts from the preview journey, and read what
                other families noticed along the way.
              </Subtitle>

              <LeaveReviewButton
                type="button"
                onClick={() => setFormOpen(true)}
              >
                Leave a Review
              </LeaveReviewButton>
            </>
          )}
        </HeaderSection>

        {formOpen && (
          <FormPanel>
            <FormHeader>
              <FormTitle>Leave a Review</FormTitle>

              <CloseButton type="button" onClick={() => setFormOpen(false)}>
                ✕
              </CloseButton>
            </FormHeader>

            <ReviewForm />
          </FormPanel>
        )}

        <ReviewsList>
          {!reviews?.length && (
            <EmptyState>
              No reviews yet. Be the first to share your thoughts.
            </EmptyState>
          )}
          {reviews.map((review) => {
            const isOpen = openReviewId === review.id;
            const rating = Number(review.answers.overall_rating ?? 0);

            return (
              <ReviewCard
                key={review.id}
                type="button"
                onClick={() => setOpenReviewId(isOpen ? null : review.id)}
              >
                <ReviewHeader>
                  <StarsRow>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <ReviewStar key={star} $filled={star <= rating}>
                        ★
                      </ReviewStar>
                    ))}
                  </StarsRow>

                  <ReviewerName>{review.reviewer_name}</ReviewerName>
                </ReviewHeader>

                {isOpen && (
                  <ReviewDetails>
                    {Object.entries(review.answers)
                      .filter(([key]) => key !== "overall_rating")
                      .map(([key, value]) => (
                        <ReviewAnswer key={key}>
                          <Question>
                            {reviewQuestionLabels[key] ?? key}
                          </Question>
                          <Answer>{String(value)}</Answer>
                        </ReviewAnswer>
                      ))}
                  </ReviewDetails>
                )}
              </ReviewCard>
            );
          })}
        </ReviewsList>
      </Content>
    </Page>
  );
}
const Page = styled.main`
  min-height: 100vh;
  padding: 120px 24px 70px;
  color: #ffffff;
`;

const Content = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const HeaderSection = styled.section`
  text-align: center;
  padding: 36px 28px;
  border-radius: 36px;

  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.48);
  box-shadow: 0 18px 50px rgba(37, 99, 146, 0.22);
  backdrop-filter: blur(14px);
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(2.3rem, 5vw, 4.4rem);
  line-height: 1.05;
  color: white;
  text-shadow: 0 4px 18px rgba(40, 91, 143, 0.38);
`;

const Subtitle = styled.p`
  max-width: 720px;
  margin: 18px auto 0;
  font-size: 1.25rem;
  line-height: 1.65;
  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0 2px 10px rgba(40, 91, 143, 0.28);
`;

const LeaveReviewButton = styled.button`
  margin-top: 28px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;

  background: linear-gradient(180deg, #fff4a8 0%, #ffd96a 100%);
  color: #315070;

  padding: 14px 28px;
  font-weight: 900;
  font-size: 1rem;
  cursor: pointer;

  box-shadow:
    0 10px 24px rgba(255, 217, 106, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);

  &:hover {
    transform: translateY(-1px);
  }
`;

const FormPanel = styled.section`
  margin-top: 30px;
  padding: 28px;
  border-radius: 34px;

  background: rgba(255, 255, 255, 0.24);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 18px 50px rgba(37, 99, 146, 0.2);
  backdrop-filter: blur(14px);
`;

const EmptyState = styled.div`
  padding: 28px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.48);
  color: rgba(255, 255, 255, 0.92);
  text-align: center;
  font-weight: 700;
`;

const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 28px;
`;

const CloseButton = styled.button`
  border: none;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.14);
  color: white;
  width: 40px;
  height: 40px;
  cursor: pointer;
`;

const ReviewsList = styled.section`
  margin-top: 28px;
`;

const ReviewCard = styled.button`
  width: 100%;
  text-align: left;

  padding: 24px;
  border-radius: 32px;

  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.48);

  box-shadow: 0 18px 40px rgba(37, 99, 146, 0.16);
  backdrop-filter: blur(14px);

  cursor: pointer;
`;

const ReviewAnswer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;

  padding-bottom: 18px;

  border-bottom: 1px solid rgba(255, 255, 255, 0.16);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const Question = styled.h3`
  margin: 0;

  font-size: 1rem;
  font-weight: 900;
  line-height: 1.4;

  color: rgba(255, 255, 255, 0.96);

  text-shadow: 0 2px 10px rgba(40, 91, 143, 0.28);
`;

const Answer = styled.p`
  margin: 0;

  font-size: 1rem;
  line-height: 1.7;

  color: rgba(255, 255, 255, 0.88);

  white-space: pre-wrap;
`;
const StarsRow = styled.div`
  display: flex;
  gap: 6px;
`;

const ReviewStar = styled.span<{ $filled: boolean }>`
  font-size: 2rem;
  color: ${({ $filled }) =>
    $filled ? "#ffd96a" : "rgba(255, 255, 255, 0.38)"};
  text-shadow: ${({ $filled }) =>
    $filled ? "0 3px 14px rgba(255, 217, 106, 0.45)" : "none"};
`;

const ReviewDetails = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

const ReviewerName = styled.div`
  font-size: 1rem;
  font-weight: 900;

  color: rgba(255, 255, 255, 0.92);

  text-shadow: 0 2px 10px rgba(40, 91, 143, 0.28);
`;
