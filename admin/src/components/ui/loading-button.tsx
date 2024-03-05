import { Loader } from "lucide-react";
import { Button, ButtonProps } from "./button";

interface Props extends ButtonProps {
  loading: boolean;
  loadingText?: string;
}

export default function LoadingButton({
  loading,
  loadingText,
  children,
  ...props
}: Props) {
  return (
    <Button disabled={loading} {...props}>
      {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
      {loading && loadingText ? loadingText : children}
    </Button>
  );
}
