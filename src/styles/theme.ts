import { createTheme } from '@mui/material/styles';
import { ERROR_CODES } from '@/common/constants';
import { validateEmail, validatePassword } from '@/common/utils';
import { AuthError, Credentials } from '@/features/auth/types';
import { signIn } from '@/features/auth/services';

const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#007bff', // Primary color
    },
    secondary: {
      main: '#6c757d', // Secondary color
    },
    error: {
      main: '#dc3545', // Error color
    },
    warning: {
      main: '#ffc107', // Warning color
    },
    info: {
      main: '#17a2b8', // Information color
    },
    success: {
      main: '#28a745', // Success color
    },
  },
  typography: {
    fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Customize button styles here
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Customize text field styles here
        },
      },
    },
    // Customize other MUI components here
  },
});

export default theme;