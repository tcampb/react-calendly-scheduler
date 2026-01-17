import { PhoneInput } from "@/components/ui/phone-input";
import { Label } from "@/components/ui/label";
import type { QuestionProps } from "./types";

export function PhoneQuestion({ question, questionKey, value, onChange }: QuestionProps) {
  return (
    <div>
      <Label htmlFor={questionKey}>
        {question.name} {question.required && "*"}
      </Label>
      <PhoneInput
        id={questionKey}
        value={value}
        onChange={(newValue) => onChange(questionKey, newValue || "")}
        defaultCountry="US"
        international
        className="mt-2"
      />
    </div>
  );
}
