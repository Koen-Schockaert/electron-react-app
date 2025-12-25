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
  disabled?: boolean;
  sx?: object;
}

export function LabeledSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled = false,
  sx,
}: LabeledSelectProps<T>) {
  return (
    <FormControl sx={sx}>
      <FormLabel sx={{ color: '#e5e7eb' }}>{label}</FormLabel>
      <Select
  value={value}
  onChange={(_, newValue) => {
    if (newValue !== null) onChange(newValue);
  }}
  disabled={disabled}
  slotProps={{
    listbox: {
      sx: {
        bgcolor: '#0f172a', // dark background for the dropdown
        color: '#e5e7eb', // white text
        border: '1px solid #1e293b',
        '& li': {
          bgcolor: '#0f172a', // default option background
          color: '#e5e7eb',
          '&:hover': { bgcolor: '#1e293b' }, // hover option
          '&[aria-selected="true"]': { bgcolor: '#3b4252' }, // selected option
        },
      },
    },
  }}
  sx={{
    bgcolor: '#020617',
    color: '#e5e7eb',
    border: '1px solid #1e293b',
    borderRadius: 1,
    '&:hover': { bgcolor: '#020617', borderColor: '#3b4252' }, // box hover
    '&:focus': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 2px rgba(99,102,241,0.2)',
    },
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
