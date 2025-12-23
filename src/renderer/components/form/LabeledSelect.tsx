import { FormControl, FormLabel, Select, Option } from '@mui/joy';

interface LabeledSelectOption<T extends string> {
  label: string;
  value: T;
}

interface LabeledSelectProps<T extends string> {
  label: string;
  value: T;
  options: LabeledSelectOption<T>[];
  onChange: (value: T) => void;
}

export function LabeledSelect<T extends string>({
  label,
  value,
  options,
  onChange,
}: LabeledSelectProps<T>) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Select
        value={value}
        onChange={(_, newValue) => {
          if (newValue !== null) {
            onChange(newValue);
          }
        }}
      >
        {options.map((opt) => (
          <Option key={opt.value} value={opt.value}>
            {opt.label}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
}
