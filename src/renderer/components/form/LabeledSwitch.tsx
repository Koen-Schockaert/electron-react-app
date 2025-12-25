import { FormControl, FormLabel, Switch } from '@mui/joy';

interface LabeledSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  sx?: object;
}

export function LabeledSwitch({
  label,
  checked,
  onChange,
  disabled = false,
  sx,
}: LabeledSwitchProps) {
  return (
    <FormControl
      orientation="horizontal"
      sx={{
        alignItems: 'center',
        gap: 1,
        ...sx,
      }}
    >
      <FormLabel sx={{ color: '#e5e7eb', minWidth: 120 }}>{label}</FormLabel>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        color="primary"
        slotProps={{
          track: {
            sx: {
              bgcolor: checked ? '#6366f1' : '#1e293b',
            },
          },
          thumb: {
            sx: {
              bgcolor: checked ? '#818cf8' : '#94a3b8',
            },
          },
        }}
      />
    </FormControl>
  );
}
