// src/components/Sidebar.jsx
import { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListIcon from "@mui/icons-material/List";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Box
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        width: open ? 220 : 56,
        transition: "width 200ms",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        bgcolor: "background.paper",
        boxShadow: 2,
        zIndex: 1200,
        overflow: "hidden",
      }}
    >
      <List>
        <ListItemButton component={Link} to="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          {open && <ListItemText primary="Dashboard" />}
        </ListItemButton>

        <ListItemButton component={Link} to="/micro">
          <ListItemIcon><FlashOnIcon /></ListItemIcon>
          {open && <ListItemText primary="Micro Tasks" />}
        </ListItemButton>

        <ListItemButton component={Link} to="/today">
          <ListItemIcon><AccessTimeIcon /></ListItemIcon>
          {open && <ListItemText primary="Today" />}
        </ListItemButton>

        <ListItemButton component={Link} to="/all">
          <ListItemIcon><ListIcon /></ListItemIcon>
          {open && <ListItemText primary="All Tasks" />}
        </ListItemButton>
      </List>
    </Box>
  );
}
