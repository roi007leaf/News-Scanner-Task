import { Input } from "./ui/input";

interface QueryInputProps {
  onChange?: (value: string) => void;
  value?: string;
}

export const QueryInput = ({ onChange, value = "" }: QueryInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div className="flex flex-col gap-2 w-full sm:w-[300px]">
      <label
        htmlFor="query-input"
        className="text-sm font-medium text-gray-700"
      >
        Search by
      </label>
      <Input
        id="query-input"
        value={value}
        onChange={handleChange}
        placeholder="What to search for?"
        className="focus:ring-[#7F56D9] focus:border-[#7F56D9] hover:border-[#7F56D9]"
      />
    </div>
  );
};
