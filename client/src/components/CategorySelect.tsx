import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface Option {
  displayName: string;
  value: string;
}

interface SelectProps {
  options?: Option[];
  onChange?: any;
  selectedOptions?: string;
}

export const CategorySelect = ({
  options = [],
  onChange,
  selectedOptions = "",
}: SelectProps) => {
  const handleChange = (value: string) => {
    onChange?.(value);
  };

  return (
    <div className="flex flex-col gap-2 w-[300px]">
      <label
        htmlFor="category-select"
        className="text-sm font-medium text-gray-700"
      >
        Category
      </label>
      <Select value={selectedOptions} onValueChange={handleChange}>
        <SelectTrigger className="focus:ring-[#7F56D9] focus:border-[#7F56D9] hover:border-[#7F56D9]">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
