import { FormControl, FormLabel, Input } from '@mui/joy';
import React from 'react';

interface LabeledInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function LabeledTextField({
  label,
  value,
  onChange,
  placeholder,
  disabled,
}: LabeledInputProps) {
  return (
    <FormControl orientation="vertical" sx={{ gap: 1, width: '100%' }}>
      <FormLabel>{label}</FormLabel>
      <Input
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        disabled={disabled}
        fullWidth
        size="sm"
      />
    </FormControl>
  );
}
