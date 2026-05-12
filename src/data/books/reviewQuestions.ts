export const reviewQuestions = [
  {
    id: "overall_rating",
    label: "Overall, how many stars would you give Cosmic Travellers?",
    type: "stars",
  },
  {
    id: "app_experience",
    label: "How easy was the app experience overall?",
    type: "rating",
  },
  {
    id: "navigation",
    label: "Was it easy to navigate between books and sections?",
    type: "select",
    options: ["Very easy", "Mostly easy", "A bit confusing", "Very confusing"],
  },
  {
    id: "technical_issues",
    label: "Did you notice any technical issues or bugs?",
    type: "textarea",
  },
  {
    id: "child_age",
    label: "What is your child’s age?",
    type: "select",
    options: ["3", "4", "5", "6", "7", "8+"],
  },
  {
    id: "watched_with_child",
    label: "Did you watch/play together with your child?",
    type: "select",
    options: ["Yes", "No", "Partly"],
  },
  {
    id: "child_engagement",
    label: "How engaged was your child?",
    type: "rating",
  },
  {
    id: "pacing",
    label: "How did the pacing feel?",
    type: "select",
    options: ["Too slow", "Just right", "Too fast"],
  },
  {
    id: "favorite_moment",
    label: "Which moment did your child enjoy most?",
    type: "textarea",
  },
  {
    id: "confusing_moment",
    label: "Was anything confusing, too long, or unclear?",
    type: "textarea",
  },
  {
    id: "learning",
    label: "Did your child seem to learn or remember anything?",
    type: "textarea",
  },
  {
    id: "characters",
    label: "Which character did your child connect with most?",
    type: "textarea",
  },
  {
    id: "magic_feeling",
    label: "Did the story feel magical/wonder-filled?",
    type: "rating",
  },
  {
    id: "would_continue",
    label: "Would your child want to continue to the next booklet?",
    type: "select",
    options: ["Yes", "No", "Not sure"],
  },
  {
    id: "overall_feedback",
    label: "Anything else you’d like to tell us?",
    type: "textarea",
  },
];

export const reviewQuestionLabels: Record<string, string> = {
  app_experience: "App experience",
  navigation: "Navigation",
  technical_issues: "Technical issues",
  child_age: "Child’s age",
  watched_together: "Watched together",
  engagement: "Child engagement",
  pacing: "Pacing",
  favorite_moment: "Favorite moment",
  confusing: "Confusing moments",
  learning: "Learning / memory",
  continue: "Would continue",
  overall: "Overall feedback",
};
