import SettingsIcon from '@mui/icons-material/Settings';
import CloudIcon from '@mui/icons-material/Cloud';

export const menuItems = [
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon,
    route: '/settings',
  },
  {
    id: 'mqtt',
    label: 'MQTT',
    icon: CloudIcon,
    route: '/mqtt',
  },
];
