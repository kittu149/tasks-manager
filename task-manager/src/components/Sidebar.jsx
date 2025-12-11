// src/components/Sidebar.jsx
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import WidgetsIcon from "@mui/icons-material/Widgets";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListIcon from "@mui/icons-material/List";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const items = [
    { to: "/", label: "Home", icon: <HomeIcon /> },
    { to: "/micro", label: "Micro Tasks", icon: <WidgetsIcon /> },
    { to: "/today", label: "Today's", icon: <AccessTimeIcon /> },
    { to: "/all", label: "All Tasks", icon: <ListIcon /> },
  ];

  return (
    <Box
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        width: open ? 220 : 60,
        transition: "width 180ms",
        bgcolor: "background.paper",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1300,
        boxShadow: 2,
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: open ? "flex-start" : "center",
        py: 2,
      }}
    >
      <List sx={{ width: "100%" }}>
        {items.map((it) => (
          <ListItemButton
            key={it.to}
            component={Link}
            to={it.to}
            sx={{ px: open ? 2 : 1.2 }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : 0, justifyContent: "center" }}>
              {it.icon}
            </ListItemIcon>
            {open ? <ListItemText primary={it.label} /> : <Tooltip title={it.label}><span /></Tooltip>}
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
