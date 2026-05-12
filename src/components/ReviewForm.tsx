import { useState } from "react";
import styled from "styled-components";
import { reviewQuestions } from "../data/books/reviewQuestions";
import { submitReview } from "../requests";

type ReviewFormProps = {
  onSubmit?: (answers: Record<string, string | number>) => void;
};

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateAnswer = (id: string, value: string | number) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setError("");
      setSuccess("");
      setIsSubmitting(true);

      await submitReview(answers);

      setSuccess("Thank you for your review!");
      setAnswers({});

      onSubmit?.(answers);
    } catch (error) {
      console.error(error);

      setError("Could not save your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Wrapper>
      <Questions>
        {reviewQuestions.map((question) => (
          <QuestionCard key={question.id}>
            <QuestionLabel>{question.label}</QuestionLabel>
            {question.type === "stars" && (
              <RatingRow>
                {[1, 2, 3, 4, 5].map((value) => (
                  <StarButton
                    key={value}
                    type="button"
                    $selected={Number(answers[question.id] ?? 0) >= value}
                    onClick={() => updateAnswer(question.id, value)}
                  >
                    ★
                  </StarButton>
                ))}
              </RatingRow>
            )}

            {question.type === "select" && (
              <Select
                value={String(answers[question.id] ?? "")}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
              >
                <option value="">Select an answer</option>

                {question.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            )}

            {question.type === "rating" && (
              <RatingRow>
                {[1, 2, 3, 4, 5].map((value) => (
                  <RatingButton
                    key={value}
                    type="button"
                    $selected={answers[question.id] === value}
                    onClick={() => updateAnswer(question.id, value)}
                  >
                    {value}
                  </RatingButton>
                ))}
              </RatingRow>
            )}

            {question.type === "textarea" && (
              <Textarea
                value={String(answers[question.id] ?? "")}
                onChange={(e) => updateAnswer(question.id, e.target.value)}
                placeholder="Write your thoughts here..."
              />
            )}
          </QuestionCard>
        ))}
      </Questions>

      <SubmitButton
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Review"}
      </SubmitButton>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {success && <SuccessMessage>{success}</SuccessMessage>}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Questions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 22px;
`;

const QuestionCard = styled.section`
  border-radius: 28px;
  padding: 24px;

  background: rgba(255, 255, 255, 0.26);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 12px 30px rgba(37, 99, 146, 0.16);
`;

const QuestionLabel = styled.label`
  display: block;
  font-size: 1.2rem;
  font-weight: 900;
  color: #315070;
  line-height: 1.4;

  text-shadow: 0 2px 10px rgba(40, 91, 143, 0.35);
`;

const Select = styled.select`
  margin-top: 16px;
  width: 100%;
  border-radius: 22px;

  border: 1px solid rgba(255, 255, 255, 0.62);
  background: rgba(255, 255, 255, 0.82);

  padding: 14px 16px;

  color: #315070;
  font-size: 1rem;
  font-weight: 700;
`;

const Textarea = styled.textarea`
  margin-top: 16px;
  width: 90%;
  min-height: 130px;

  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.62);

  background: rgba(255, 255, 255, 0.82);

  padding: 16px;

  color: #315070;
  font-size: 1rem;

  resize: vertical;

  &::placeholder {
    color: rgba(49, 80, 112, 0.55);
  }
`;

const RatingRow = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 12px;
`;

const RatingButton = styled.button<{
  $selected: boolean;
}>`
  width: 48px;
  height: 48px;

  border-radius: 999px;

  border: 1px solid rgba(255, 255, 255, 0.7);

  cursor: pointer;

  font-weight: 900;

  background: ${({ $selected }) =>
    $selected
      ? "linear-gradient(180deg, #fff4a8 0%, #ffd96a 100%)"
      : "rgba(255, 255, 255, 0.34)"};

  color: ${({ $selected }) => ($selected ? "#315070" : "#ffffff")};

  box-shadow: ${({ $selected }) =>
    $selected
      ? "0 8px 20px rgba(255, 217, 106, 0.35)"
      : "0 8px 18px rgba(37, 99, 146, 0.14)"};
`;

const SubmitButton = styled.button`
  align-self: center;

  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 999px;

  background: linear-gradient(180deg, #fff4a8 0%, #ffd96a 100%);

  color: #315070;

  padding: 16px 34px;

  font-size: 1rem;
  font-weight: 900;

  cursor: pointer;

  box-shadow:
    0 10px 24px rgba(255, 217, 106, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);

  &:hover {
    transform: translateY(-1px);
  }
`;
const ErrorMessage = styled.p`
  margin: 0;
  text-align: center;
  color: #ffe1e1;
  font-weight: 800;
`;

const SuccessMessage = styled.p`
  margin: 0;
  text-align: center;
  color: #fff4a8;
  font-weight: 900;
`;

const StarButton = styled.button<{ $selected: boolean }>`
  border: none;
  background: transparent;
  cursor: pointer;

  font-size: 2.2rem;
  line-height: 1;

  color: ${({ $selected }) =>
    $selected ? "#ffd96a" : "rgba(255, 255, 255, 0.45)"};

  text-shadow: ${({ $selected }) =>
    $selected ? "0 3px 14px rgba(255, 217, 106, 0.45)" : "none"};
`;
