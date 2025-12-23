import { FormControl, FormLabel, Switch } from '@mui/joy';

interface LabeledSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function LabeledSwitch({
  label,
  checked,
  onChange,
}: LabeledSwitchProps) {
  return (
    <FormControl orientation="horizontal" sx={{ alignItems: 'center', gap: 1 }}>
      <FormLabel>{label}</FormLabel>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </FormControl>
  );
}
