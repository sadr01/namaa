// icons.js
import * as MuiIcons from "@mui/icons-material";
import React from 'react';
export const icons = Object.keys(MuiIcons).map((name) => ({
  title: name,
  icon: React.createElement(MuiIcons[name]),
}));

export const getIconByTitle = (title) => {
  const IconComponent = MuiIcons[title];
  return IconComponent ? <IconComponent /> : null;
};
