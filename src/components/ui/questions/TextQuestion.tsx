import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QuestionProps } from "./types";

export function TextQuestion({ question, questionKey, value, onChange }: QuestionProps) {
  return (
    <div>
      <Label htmlFor={questionKey}>
        {question.name} {question.required && "*"}
      </Label>
      <Textarea
        id={questionKey}
        value={value}
        onChange={(e) => onChange(questionKey, e.target.value)}
        placeholder="Enter your response..."
        required={question.required}
        className="mt-2"
      />
    </div>
  );
}
