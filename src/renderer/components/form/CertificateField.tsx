import { Box, Button, FormControl, FormLabel, Input } from "@mui/joy";

interface CertificateFieldProps {
  label: string;
  value?: string;
  onChange: (path: string | undefined) => void;
  filters?: { name: string; extensions: string[] }[];
  disabled?: boolean;
  sx?: object; // <-- add this
}

export function CertificateField({
  label,
  value,
  onChange,
  filters = [{ name: 'Certificates', extensions: ['pem', 'crt', 'key'] }],
  disabled = false,
  sx,
}: CertificateFieldProps) {
  const browse = async () => {
    const path = await window.fileAPI.openFile({
      properties: ['openFile'],
      filters,
    });
    if (path) onChange(path);
  };

  return (
    <FormControl sx={sx}>
      <FormLabel sx={{ color: '#e5e7eb' }}>{label}</FormLabel>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Input
          value={value ?? ''}
          readOnly
          disabled={disabled}
          sx={{
            flex: 1,
            bgcolor: '#0f172a',
            color: '#e5e7eb',
            border: '1px solid #1e293b',
          }}
        />
        <Button
          variant="outlined"
          onClick={browse}
          disabled={disabled}
          sx={{
            bgcolor: '#0f172a',
            color: '#e5e7eb',
            borderColor: '#1e293b',
            '&:hover': { bgcolor: '#1e293b' },
          }}
        >
          Browse
        </Button>
      </Box>
    </FormControl>
  );
}
