import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/joy';
import type { MqttConnectionProfile } from './types';
import ProfileList from './ProfileList';
import ProfileForm from './ProfileForm';
import { v4 as uuidv4 } from 'uuid';
import { useMqtt } from '../../../context/MqttContext';

export default function MqttSettings() {
  const [profiles, setProfiles] = useState<
    Record<string, MqttConnectionProfile>
  >({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [draftProfile, setDraftProfile] =
    useState<MqttConnectionProfile | null>(null);
  const { connected, clientProfile } = useMqtt();

  const loadProfiles = async () => {
    const loaded = await window.settingsAPI.getMqttProfiles();
    setProfiles(loaded);
    if (!activeId && Object.keys(loaded).length)
      setActiveId(Object.keys(loaded)[0]);
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
    <Box sx={{ display: 'flex', height: '100%' }}>
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

      <Box sx={{ flex: 1 }}>
        {profileToEdit ? (
          <ProfileForm
            profile={profileToEdit}
            onSave={handleSave}
            onCancel={() => setDraftProfile(null)}
          />
        ) : (
          <Box sx={{ p: 2, color: 'text.secondary' }}>
            Select or create a profile
          </Box>
        )}
      </Box>
    </Box>
  );
}
