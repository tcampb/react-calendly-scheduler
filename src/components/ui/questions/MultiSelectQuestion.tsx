import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { QuestionProps } from "./types";

interface MultiSelectQuestionProps extends QuestionProps {
  otherValue: string;
  onOtherChange: (key: string, value: string) => void;
}

export function MultiSelectQuestion({
  question,
  questionKey,
  value,
  onChange,
  otherValue,
  onOtherChange,
}: MultiSelectQuestionProps) {
  const selectedValues = value || [];

  const handleCheckboxChange = (choice: string, checked: boolean) => {
    if (checked) {
      onChange(questionKey, [...selectedValues, choice]);
    } else {
      onChange(questionKey, selectedValues.filter((c: string) => c !== choice));
    }
  };

  return (
    <div>
      <Label>
        {question.name} {question.required && "*"}
      </Label>
      <div className="mt-2 space-y-2">
        {question.answer_choices.map((choice: string, i: number) => (
          <div key={i} className="flex items-center space-x-2">
            <Checkbox
              id={`${questionKey}_${i}`}
              checked={selectedValues.includes(choice)}
              onCheckedChange={(checked) => handleCheckboxChange(choice, !!checked)}
            />
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
              <Checkbox
                id={`${questionKey}_other`}
                checked={selectedValues.includes("other")}
                onCheckedChange={(checked) => handleCheckboxChange("other", !!checked)}
              />
              <Label
                htmlFor={`${questionKey}_other`}
                className="font-normal cursor-pointer"
              >
                Other
              </Label>
            </div>
            {selectedValues.includes("other") && (
              <Input
                placeholder="Please specify..."
                value={otherValue}
                onChange={(e) => onOtherChange(`${questionKey}_other`, e.target.value)}
                className="mt-1"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
