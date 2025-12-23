import { FormControl, FormLabel, Input } from '@mui/joy';
import type { InputProps } from '@mui/joy';

type LabeledInputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
} & Pick<InputProps, 'type' | 'placeholder' | 'disabled'>;

export function LabeledInput({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
}: LabeledInputProps) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
      />
    </FormControl>
  );
}
