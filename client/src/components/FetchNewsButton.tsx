import React from "react";
import { Button } from "./ui/button";

interface FetchNewsButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

export const FetchNewsButton: React.FC<FetchNewsButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <div className="flex items-center">
      <Button
        onClick={onClick}
        disabled={disabled}
        className="h-10 bg-[#7F56D9] hover:bg-[#7F56D9]/90 text-white font-medium text-sm tracking-wide disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed"
      >
        Fetch News
      </Button>
    </div>
  );
};
