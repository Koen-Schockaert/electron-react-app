import { List, ListItemButton, ListItemDecorator } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { menuItems } from '../navigation/MenuConfig';

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <List sx={{ p: 1 }}>
      {menuItems.map((item) => (
        <ListItemButton key={item.id} onClick={() => navigate(item.route)}>
          <ListItemDecorator>
            <item.icon />
          </ListItemDecorator>
          {item.label}
        </ListItemButton>
      ))}
    </List>
  );
}
