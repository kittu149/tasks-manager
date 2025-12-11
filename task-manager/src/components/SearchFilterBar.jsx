// src/components/SearchFilterBar.jsx
import { useState } from "react";
import { TextField, IconButton, Box, MenuItem, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";

export default function SearchFilterBar({ onSearch }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");

  function apply() {
    onSearch({ q, type, priority });
  }

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
      <IconButton onClick={() => setOpen(!open)}><SearchIcon /></IconButton>
      {open && (
        <>
          <TextField placeholder="Search title..." value={q} onChange={(e) => setQ(e.target.value)} size="small" />
          <TextField size="small" select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="micro">Micro</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="project">Project</MenuItem>
          </TextField>
          <TextField size="small" select label="Priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="1">1</MenuItem>
            <MenuItem value="2">2</MenuItem>
            <MenuItem value="3">3</MenuItem>
            <MenuItem value="4">4</MenuItem>
            <MenuItem value="5">5</MenuItem>
          </TextField>
          <Button variant="contained" onClick={apply} startIcon={<FilterListIcon />}>Apply</Button>
        </>
      )}
    </Box>
  );
}
