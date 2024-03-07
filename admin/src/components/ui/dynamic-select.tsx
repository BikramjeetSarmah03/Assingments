/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface DynamicSelectProps {
  url: string;
  onChange: (...event: any[]) => void;
  placeholder: string;
  optionName: string;
  optionValue: string;
  value: string;
  className?: string;
}

export default function DynamicSelect({
  url,
  onChange,
  placeholder,
  optionName,
  optionValue,
  value,
  className,
}: DynamicSelectProps) {
  const [options, setOptions] = useState([]);

  useMemo(() => {
    const abortController = new AbortController();

    const getData = async (signal: AbortSignal) => {
      const { data: resData } = await api.get(url, { signal });

      setOptions(resData);
    };

    getData(abortController.signal);

    return () => abortController.abort();
  }, [url]);

  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn("max-w-60", className)}>
        <SelectGroup>
          {typeof options === "object" &&
            options.length &&
            options?.map((option: any, index) => {
              return (
                <SelectItem
                  className="whitespace-nowrap"
                  value={String(option?.[optionValue])}
                  key={index}>
                  {option?.[optionName]}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
