import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

const UrlList = ({ urls }) => (
  <List>
    {urls.map((u, idx) => (
      <ListItem key={idx}>
        <ListItemText
          primary={`http://localhost:3000/${u.shortcode}`}
          secondary={`Valid till: ${u.expiresAt}`}
        />
      </ListItem>
    ))}
  </List>
);

export default UrlList;
