import { Box, Button, Input, FormControl, FormLabel } from '@mui/joy';

interface CertificateFieldProps {
  label: string;
  value?: string;
  onChange: (path: string | undefined) => void;
  filters?: { name: string; extensions: string[] }[];
}

export function CertificateField({
  label,
  value,
  onChange,
  filters = [{ name: 'Certificates', extensions: ['pem', 'crt', 'key'] }],
}: CertificateFieldProps) {
  const browse = async () => {
    const path = await window.fileAPI.openFile({
      properties: ['openFile'],
      filters,
    });
    if (path) onChange(path);
  };

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Input value={value ?? ''} readOnly />
        <Button variant="outlined" onClick={browse}>
          Browse
        </Button>
      </Box>
    </FormControl>
  );
}
