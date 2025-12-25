import { Box, Typography, Input } from '@mui/joy';

interface DarkTextFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DarkTextField: React.FC<DarkTextFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => (
  <Box display="flex" flexDirection="column" mb={1}>
    <Typography fontSize={12} sx={{ color: '#9ca3af' }} mb={0.5}>
  {label}
</Typography>

    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      size="sm"
      sx={{
        bgcolor: '#0f172a',
        color: '#e5e7eb',
        border: '1px solid #1e293b',
        borderRadius: 1,
        '& input': {
          color: '#e5e7eb',
        },
        '&:hover': {
          borderColor: '#3b82f6',
        },
        '&:disabled': {
          opacity: 0.6,
        },
      }}
    />
  </Box>
);
