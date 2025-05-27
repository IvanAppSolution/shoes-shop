import type { Control } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { ReactNode } from "react";
export interface InputFormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  description?: string | ReactNode;
  inputType?: string;
  formControl: Control<z.infer<Zod.ZodTypeAny>>;
  className?: string;
  containerClassName?: string;
}

export const InputFormField: React.FC<InputFormFieldProps> = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
  className,
  containerClassName,
}) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field: fieldProps }) => (
        <FormItem className={containerClassName}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={inputType || "text"}
              {...fieldProps}
              className={className}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};