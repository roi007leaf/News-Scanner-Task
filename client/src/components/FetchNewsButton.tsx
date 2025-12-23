import React from "react";
import { Button } from "./ui/button";

interface FetchNewsButtonProps {
  onClick?: () => void;
}

export const FetchNewsButton: React.FC<FetchNewsButtonProps> = ({
  onClick,
}) => {
  return (
    <div className="flex items-center">
      <Button
        onClick={onClick}
        className="h-10 bg-[#7F56D9] hover:bg-[#7F56D9]/90 text-white font-medium text-sm tracking-wide"
      >
        Fetch News
      </Button>
    </div>
  );
};
