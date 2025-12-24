import SettingsIcon from '@mui/icons-material/Settings';
import CloudIcon from '@mui/icons-material/Cloud';
import EditIcon from '@mui/icons-material/Edit';

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
  {
    id: 'json-editor',
    label: 'JSON Editor',
    icon: EditIcon,
    route: '/json-editor'
  }
];
