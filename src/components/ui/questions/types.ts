import type { CustomQuestion } from "react-calendly-components";

export interface QuestionProps {
  question: CustomQuestion;
  questionKey: string;
  value: any;
  onChange: (key: string, value: any) => void;
}
