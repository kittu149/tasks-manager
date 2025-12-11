// src/components/SearchFilterBar.jsx
import { useState } from "react";
import { Box, IconButton, TextField, Collapse, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchFilterBar({ onSearch }) {
  const [expand, setExpand] = useState(false);
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [priority, setPriority] = useState("");

  function apply() {
    onSearch({ q, type, priority });
  }

  return (
    <Box sx={{ mb: 2 }}>
      <IconButton onClick={() => setExpand(!expand)}>
        <SearchIcon />
      </IconButton>

      <Collapse in={expand}>
        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
          <TextField
            label="Search title"
            value={q}
            onChange={(e) => { setQ(e.target.value); apply(); }}
          />

          <TextField
            label="Type"
            select
            value={type}
            onChange={(e) => { setType(e.target.value); apply(); }}
            sx={{ width: 130 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="micro">Micro</MenuItem>
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="project">Project</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </TextField>

          <TextField
            label="Priority"
            select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); apply(); }}
            sx={{ width: 130 }}
          >
            <MenuItem value="">All</MenuItem>
            {[1,2,3,4,5].map(p => (
              <MenuItem key={p} value={p}>{p}</MenuItem>
            ))}
          </TextField>
        </Box>
      </Collapse>
    </Box>
  );
}
