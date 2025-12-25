import { FormControl, FormLabel, Input } from '@mui/joy';
import type { InputProps } from '@mui/joy';

type LabeledInputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  disabled?: boolean;
  placeholder?: string;
  sx?: object; // simple typing for Joy's sx
} & Pick<InputProps, 'type' | 'disabled' | 'placeholder'>;

export function LabeledInput({
  label,
  value,
  onChange,
  type = 'text',
  disabled = false,
  placeholder,
  sx,
}: LabeledInputProps) {
  return (
    <FormControl sx={sx}>
      <FormLabel sx={{ color: '#e5e7eb' }}>{label}</FormLabel>
      <Input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          bgcolor: '#020617',
          color: '#e5e7eb',
          border: '1px solid #1e293b',
          borderRadius: 1,
          '&:hover': { borderColor: '#3b4252' },
          '&:focus': {
            borderColor: '#6366f1',
            boxShadow: '0 0 0 2px rgba(99,102,241,0.2)',
          },
        }}
      />
    </FormControl>
  );
}
