import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { QuestionProps } from "./types";

interface SingleSelectQuestionProps extends QuestionProps {
  otherValue: string;
  onOtherChange: (key: string, value: string) => void;
}

export function SingleSelectQuestion({
  question,
  questionKey,
  value,
  onChange,
  otherValue,
  onOtherChange,
}: SingleSelectQuestionProps) {
  return (
    <div>
      <Label>
        {question.name} {question.required && "*"}
      </Label>
      <RadioGroup
        value={value}
        onValueChange={(newValue) => onChange(questionKey, newValue)}
        className="mt-2"
      >
        {question.answer_choices.map((choice: string, i: number) => (
          <div key={i} className="flex items-center space-x-2">
            <RadioGroupItem id={`${questionKey}_${i}`} value={choice} />
            <Label
              htmlFor={`${questionKey}_${i}`}
              className="font-normal cursor-pointer"
            >
              {choice}
            </Label>
          </div>
        ))}
        {question.include_other && (
          <div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id={`${questionKey}_other`} value="other" />
              <Label
                htmlFor={`${questionKey}_other`}
                className="font-normal cursor-pointer"
              >
                Other
              </Label>
            </div>
            {value === "other" && (
              <Input
                placeholder="Please specify..."
                value={otherValue}
                onChange={(e) => onOtherChange(`${questionKey}_other`, e.target.value)}
                className="mt-1"
              />
            )}
          </div>
        )}
      </RadioGroup>
    </div>
  );
}
