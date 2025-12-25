import { useEffect, useState } from 'react';
import { Box } from '@mui/joy';
import type { MqttConnectionProfile } from './types';
import ProfileList from './ProfileList';
import ProfileForm from './ProfileForm';
import { v4 as uuidv4 } from 'uuid';
import { useMqtt } from '../../../context/MqttContext';

export default function MqttSettings() {
  const [profiles, setProfiles] = useState<Record<string, MqttConnectionProfile>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draftProfile, setDraftProfile] = useState<MqttConnectionProfile | null>(null);
  const { connected, clientProfile } = useMqtt();

  const loadProfiles = async () => {
    const loaded = await window.settingsAPI.getMqttProfiles();
    setProfiles(loaded);
    if (!activeId && Object.keys(loaded).length) setActiveId(Object.keys(loaded)[0]);
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this profile?');
    if (!confirmed) return;
    await window.settingsAPI.deleteMqttProfile(id);
    await loadProfiles();
    if (activeId === id) setActiveId(null);
  };

  const handleSave = async (profile: MqttConnectionProfile) => {
    await window.settingsAPI.upsertMqttProfile(profile);
    await loadProfiles();
    setActiveId(profile.id);
    setDraftProfile(null);
  };

  const handleCreate = () => {
    setDraftProfile({
      id: uuidv4(),
      name: '',
      host: '',
      port: 1883,
      protocol: 'mqtt',
      cleanSession: true,
      keepAlive: 60,
    });
    setActiveId(null);
  };

  const activeProfile = activeId ? profiles[activeId] : null;
  const profileToEdit = draftProfile ?? activeProfile;

  return (
    <Box display="flex" height="100%" bgcolor="#0f172a" color="#e5e7eb">
      {/* Left sidebar: profile list */}
      <Box
        width={300}
        borderRight="1px solid #1e293b"
        bgcolor="#020617"
        display="flex"
        flexDirection="column"
        overflow="auto"
      >
        <ProfileList
          profiles={profiles}
          activeId={activeId}
          connected={connected}
          connectedProfileId={clientProfile?.id ?? null}
          onSelect={(id) => {
            setDraftProfile(null);
            setActiveId(id);
          }}
          onDelete={handleDelete}
          onCreate={handleCreate}
        />
      </Box>

      {/* Right pane: form */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        overflow="auto"
      >
        {profileToEdit ? (
          <ProfileForm
            profile={profileToEdit}
            onSave={handleSave}
            onCancel={() => setDraftProfile(null)}
          />
        ) : (
          <Box p={2} color="text.secondary">
            Select or create a profile
          </Box>
        )}
      </Box>
    </Box>
  );
}
