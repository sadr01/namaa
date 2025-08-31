import { createTheme } from '@mui/material/styles';
import { faIR } from "@mui/x-data-grid/locales";

export const adminTheme = createTheme({
  direction: "rtl",

  typography: {
    fontFamily: 'Vazir, Arial, sans-serif',
    allVariants: {
      color: '#1b2a41',
    },
  },
  palette: {
    primary: {
      main: '#1b2a41',
      contrastText: '#faf7f0',
    },
    secondary: {
      main: "#4C5C68",
      contrastText: "#4C5C68",
    },
    error: {
      main: "#E07122",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "#1b2a41",
    },
    text: {
      primary: '#1b2a41',
      secondary: '#1b2a41',
    },
    action: {
      active: '#1b2a41',
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "#1b2a41",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1b2a41",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1b2a41",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#1b2a41",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#1b2a41",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#1b2a41',
        },
      },
    },
  },
}, faIR);

export const clientTheme = createTheme({
  typography: {
    fontFamily: 'Vazir, Arial, sans-serif',
    allVariants: {
      color: '#fff',
    },
  },
  palette: {
    primary: {
      main: '#ffffff',
      contrastText: '#9720b1',
    },
    text: {
      primary: '#fff',    // متن‌ها
      secondary: '#fff',  // متن‌های ثانویه
    },
    action: {
      active: '#fff',     // رنگ آیکون‌ها
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color: "white",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
      },
    },
  },
});
