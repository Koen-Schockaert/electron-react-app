import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/joy';
import type { MqttConnectionProfile, MqttTestResult } from './types';
import { v4 as uuidv4 } from 'uuid';
import { LabeledInput } from '../../../components/form/LabeledInput';
import { LabeledSelect } from '../../../components/form/LabeledSelect';
import { LabeledSwitch } from '../../../components/form/LabeledSwitch';
import { CertificateField } from '../../../components/form/CertificateField';
import { useMqtt } from '../../../context/MqttContext';

interface ProfileFormProps {
  profile: MqttConnectionProfile | null;
  onSave: (profile: MqttConnectionProfile, password?: string) => void;
  onCancel?: () => void;
  connected?: boolean;
}

export default function ProfileForm({
  profile,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [form, setForm] = useState<MqttConnectionProfile>(
    profile ?? {
      id: uuidv4(),
      name: '',
      host: '',
      port: 1883,
      protocol: 'mqtt',
      cleanSession: true,
      keepAlive: 60,
    },
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<MqttTestResult | null>(null);
  const [password, setPassword] = useState('');
  const { connected, setConnected, setClientProfile, clientProfile } =
    useMqtt();
  const isActiveProfile = connected && clientProfile?.id === profile?.id;

  const SectionHeader = ({ title }: { title: string }) => (
    <Typography
      level="title-sm"
      sx={{
        mt: 2,
        mb: 1,
        color: 'gray',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
      }}
    >
      {title}
    </Typography>
  );

  useEffect(() => {
    if (profile) {
      setForm(profile);
      setTestResult(null);
      setTesting(false);
    }
  }, [profile]);

  const handleChange = <K extends keyof MqttConnectionProfile>(
    key: K,
    value: MqttConnectionProfile[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      alert('Profile name is required');
      return;
    }
    onSave(form, password || undefined);
    setPassword('');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await window.settingsAPI.testMqttConnection(form);
      setTestResult(result);
    } finally {
      setTesting(false);
    }
  };

  const handleConnect = async () => {
    setTesting(true);
    try {
      const connectPayload: any = {
        url: `${form.protocol}://${form.host}:${form.port}`,
        username: form.username,
        password: form.password,
      };
      if (form.caPath) connectPayload.caPath = form.caPath;
      if (form.certPath) connectPayload.certPath = form.certPath;
      if (form.keyPath) connectPayload.keyPath = form.keyPath;

      await window.mqttAPI.connect(connectPayload);
      setConnected(true);
      setClientProfile(profile);
      setTestResult({ success: true, message: 'Connected!' });
    } catch (err: any) {
      setConnected(false);
      setClientProfile(null);
      setTestResult({
        success: false,
        message: `Connection failed: ${err.message || err}`,
      });
    } finally {
      setTesting(false);
    }
  };

  const handleDisconnect = async () => {
    await window.mqttAPI.disconnect();
    setConnected(false);
    setTestResult({ success: false, message: 'Disconnected' });
  };

  return (
    <Box
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#0f172a',
        color: '#e5e7eb',
      }}
    >
      <Stack spacing={2} sx={{ flex: 1, overflowY: 'auto' }}>
        <SectionHeader title="Connection" />

        <LabeledInput
          label="Name"
          value={form.name}
          onChange={(value: string) => handleChange('name', value)}
          disabled={isActiveProfile}
          sx={{ input: { bgcolor: '#020617', color: '#e5e7eb' } }}
        />

        <Stack direction="row" spacing={2}>
          <Box sx={{ flex: 2 }}>
            <LabeledInput
              label="Host"
              value={form.host}
              onChange={(value: string) => handleChange('host', value)}
              disabled={isActiveProfile}
              sx={{ input: { bgcolor: '#020617', color: '#e5e7eb' } }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Port"
              type="number"
              value={form.port}
              onChange={(value: string) => handleChange('port', Number(value))}
              disabled={isActiveProfile}
              sx={{ input: { bgcolor: '#020617', color: '#e5e7eb' } }}
            />
          </Box>
        </Stack>

        <LabeledSelect
          label="Protocol"
          value={form.protocol}
          options={[
            { label: 'mqtt', value: 'mqtt' },
            { label: 'mqtts', value: 'mqtts' },
            { label: 'ws', value: 'ws' },
            { label: 'wss', value: 'wss' },
          ]}
          onChange={(value) => handleChange('protocol', value)}
          disabled={isActiveProfile}
          sx={{ select: { bgcolor: '#020617', color: '#e5e7eb' } }}
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ flex: 1 }}>
            <LabeledSwitch
              label="Clean Session"
              checked={form.cleanSession}
              onChange={(checked) => handleChange('cleanSession', checked)}
              disabled={isActiveProfile}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Keep Alive"
              type="number"
              value={form.keepAlive}
              onChange={(value: string) =>
                handleChange('keepAlive', Number(value))
              }
              disabled={isActiveProfile}
              sx={{ input: { bgcolor: '#020617', color: '#e5e7eb' } }}
            />
          </Box>
        </Stack>

        <SectionHeader title="Authentication" />

        <Stack direction="row" spacing={2}>
          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Username"
              value={form.username ?? ''}
              onChange={(value: string) =>
                handleChange('username', value || undefined)
              }
              disabled={isActiveProfile}
              sx={{ input: { bgcolor: '#020617', color: '#e5e7eb' } }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <LabeledInput
              label="Password"
              type="password"
              value={form.password ?? ''}
              onChange={(value: string) =>
                handleChange('password', value || undefined)
              }
              disabled={isActiveProfile}
              sx={{ input: { bgcolor: '#020617', color: '#e5e7eb' } }}
            />
          </Box>
        </Stack>

        {['mqtts', 'wss'].includes(form.protocol) && (
          <>
            <SectionHeader title="TLS / Certificates" />

            <CertificateField
              label="CA Certificate"
              value={form.caPath}
              onChange={(path) => handleChange('caPath', path)}
              disabled={isActiveProfile}
              sx={{ mb: 2 }}
            />

            <CertificateField
              label="Client Certificate"
              value={form.certPath}
              onChange={(path) => handleChange('certPath', path)}
              disabled={isActiveProfile}
              sx={{ mb: 2 }}
            />

            <CertificateField
              label="Client Key"
              value={form.keyPath}
              onChange={(path) => handleChange('keyPath', path)}
              disabled={isActiveProfile}
              sx={{ mb: 2 }}
            />
          </>
        )}

        <SectionHeader title="Actions" />

        <Stack direction="row" spacing={1}>
          <Button onClick={handleSave} disabled={isActiveProfile}>
            Save
          </Button>

          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={isActiveProfile}
            >
              Cancel
            </Button>
          )}

          <Button
            variant="outlined"
            color={connected ? 'danger' : 'primary'}
            onClick={connected ? handleDisconnect : handleConnect}
          >
            {connected ? 'Disconnect' : 'Connect'}
          </Button>

          <Button
            variant="outlined"
            loading={testing}
            onClick={handleTestConnection}
            disabled={isActiveProfile}
          >
            Test
          </Button>
        </Stack>

        {testResult && (
          <Typography
            level="body-sm"
            color={testResult.success ? 'success' : 'danger'}
            sx={{ mt: 1 }}
          >
            {testResult.message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
