import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';
import ErrorText from '../components/ui/ErrorText';

// UI/UX Standard
/*
  These objects exists solely for the ease of reference. It is NOT included in the theme object.
*/

/*  Colors  */
const mono = {
  white: '#FFFFFF',
  veryLightGray: '#F8F8F8',
  lightGray: '#EAEAEA',
  emptyGray: '#C4C4C4',
  gray: '#CACACA',
  semiDarkGray: '#AAAAAA',
  darkGray: '#656565',
  lightBlack: '#090909',
  black: '#000000',
};

const blue = {
  60: '#8DD1FF',
  80: '#6DC5FF',
  100: '#1EA5FF',
  dark: '#1184D1',
};

const red = {
  60: '#FF9A9A',
  80: '#FF8176',
  100: '#EA3222',
  dark: '#D51D0D',
};

const palette = {
  /*
  Default components applies colors in "grey" sub-object if "color" prop was not specified.
  See component source code to see which one it applies
  (eg. grey[300] for contained Button backgroundColor).
  */
  grey: {
    100: mono.lightGray,
    300: mono.gray, // root backgroundColor for Contained Buttons, etc.
    A100: mono.lightGray,
    A400: mono.darkGray,
    A500: mono.emptyGray,
    A700: mono.semiDarkGray,
  },

  black: {
    main: mono.lightBlack,
    dark: mono.black,
  },

  // primary: blue
  primary: {
    light: blue[60],
    hover: blue[80],
    main: blue[100],
    dark: blue.dark,
    contrastText: 'white',
  },
  // secondary: red
  secondary: {
    light: red[60],
    main: red[100],
    dark: red.dark,
    contrastText: 'white',
  },

  green: {
    main: blue[100],
  },

  action: {
    disabledBackground: mono.gray,
    disabled: mono.lightGray, // font color
    disabledOpacity: '100%',
  },

  background: {
    default: mono.veryLightGray, // mono - very light
    paper: 'white',
    card: 'white',
  },
};

const typography = {
  /* Note: to change default html font size (basis of 'rem'), go to src/styles/index.css */

  // UI/UX style name
  // H1
  h1: {
    fontSize: '5.33rem',
    fontWeight: 500,
    letterSpacing: '-1%',
    lineHeight: 131 / 96,
    fontFamily: 'Noto Sans',
  },

  // H2
  h2: {
    fontSize: '3.33rem',
    fontWeight: 500,
    letterSpacing: '-1%',
    lineHeight: 82 / 60,
    fontFamily: 'Noto Sans',
  },

  // Big Title
  h3: {
    fontSize: '2.67rem',
    fontWeight: 700,
    lineHeight: 65 / 48,
    // letterSpacing: '-0.01rem',
    fontFamily: 'Noto Sans',
  },

  // Title
  h4: {
    fontSize: '1.33rem',
    fontWeight: 700,
    lineHeight: 33 / 24,
    // letterSpacing: '-0.01rem',
    fontFamily: 'Noto Sans',
  },

  // Bold-Body
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 25 / 18,
    // letterSpacing: '-0.01rem',
    fontFamily: 'Noto Sans',
  },

  // Body
  body1: {
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 25 / 18,
    // letterSpacing: '-0.01rem',
    fontFamily: 'Noto Sans',
  },

  // Sub-body
  body2: {
    fontSize: '0.89rem',
    fontWeight: 400,
    lineHeight: 22 / 16,
    // letterSpacing: '-0.01rem',
    fontFamily: 'Noto Sans',
  },

  // Caption
  caption: {
    fontSize: '0.78rem',
    fontWeight: 300,
    lineHeight: 19 / 14,
    // letterSpacing: '-0.02rem',
    fontFamily: 'Noto Sans',
  },

  button: {
    textTransform: 'none',
    fontSize: '1rem',
    lineHeight: 24 / 20,
    // letterSpacing: '-0.01rem',
    fontFamily: 'Noto Sans',
  },
};

const shape = {
  borderRadius: 10,
};

const overrides = {
  MuiCssBaseline: {
    '@global': {
      a: {
        textDecoration: 'none',
        color: blue[100],
        cursor: 'pointer',
        '&:hover': {
          color: blue[80],
        },
        '&:active': {
          color: blue.dark,
        },
      },
    },
  },
  // "Button"
  MuiButton: {
    root: {
      borderRadius: '5px',
      height: '40px',
      transition: 'background 0.2s',
      margin: '10px 5px 10px 5px',
      padding: '8.5px 25px 10px 25px',
    },
    contained: {
      '&:hover': {
        backgroundColor: palette.grey[100],
      },
      '&:active': {
        backgroundColor: palette.grey.A700,
      },
      '& path': {
        fill: mono.black,
      },
      '&$disabled': {
        '& path': {
          fill: mono.lightGray,
        },
      },
    },
    containedPrimary: {
      '&:hover': {
        backgroundColor: palette.primary.light,
      },
      '&:active': {
        backgroundColor: palette.primary.dark,
      },
      '& path': {
        fill: mono.white,
      },
    },
    containedSecondary: {
      '&:hover': {
        backgroundColor: palette.secondary.light,
      },
      '&:active': {
        backgroundColor: palette.secondary.dark,
      },
      '& path': {
        fill: mono.white,
      },
    },
    text: {
      margin: '10px 5px 10px 5px',
      padding: '8.5px 25px 10px 25px',
      '&$disabled': {
        color: mono.gray,
        '& path': {
          fill: mono.gray,
        },
      },
    },
    textPrimary: {
      '&:hover': {
        backgroundColor: blue[60],
      },
      '&:active': {
        backgroundColor: blue[80],
      },
      '& path': {
        fill: blue[100],
      },
    },
    textSecondary: {
      '&:hover': {
        backgroundColor: red[60],
      },
      '&:active': {
        backgroundColor: red[80],
      },
      '& path': {
        fill: red[100],
      },
    },
    outlined: {
      margin: '10px 5px 10px 5px',
      padding: '7.5px 24px 9px 24px',
      '&:hover': {
        backgroundColor: mono.lightGray,
      },
      '&:active': {
        backgroundColor: mono.semiDarkGray,
      },
      '& path': {
        fill: mono.black,
        height: '20px',
        width: '20px',
      },
      '&$disabled': {
        color: mono.gray,
        '& path': {
          fill: mono.gray,
        },
      },
    },
    outlinedPrimary: {
      '&:hover': {
        color: mono.white,
        backgroundColor: blue[60],
        '& path': {
          fill: mono.white,
        },
      },
      '&:active': {
        color: mono.white,
        backgroundColor: blue.dark,
        '& path': {
          fill: mono.white,
        },
      },
      '& path': {
        fill: blue[100],
      },
    },
    outlinedSecondary: {
      '&:hover': {
        color: mono.white,
        backgroundColor: red[60],
        '& path': {
          fill: mono.white,
        },
      },
      '&:active': {
        color: mono.white,
        backgroundColor: red.dark,
        '& path': {
          fill: mono.white,
        },
      },
      '& path': {
        fill: red[100],
      },
    },
    startIcon: {
      marginRight: '10px',
      marginLeft: '0px',
      '& path': {
        height: '20px',
        width: '20px',
      },
    },
    endIcon: {
      marginLeft: '10px',
      marginRight: '0px',
      '& path': {
        height: '20px',
        width: '20px',
      },
    },
  },

  MuiIconButton: {
    root: {
      color: mono.black,
      height: '30px',
      width: '30px',
      '&:hover': {
        backgroundColor: mono.lightGray,
      },
      '&:active': {
        backgroundColor: mono.gray,
        '& path': {
          fill: mono.white,
        },
      },
      '& path': {
        fill: mono.black,
      },
      '&$disabled': {
        '& path': {
          fill: mono.gray,
        },
      },
    },
  },
  MuiLink: {
    root: {
      textDecoration: 'none',
      color: blue[100],
      cursor: 'pointer',
      '&:hover': {
        color: blue[80],
      },
      '&:active': {
        color: blue.dark,
      },
    },
    underlineHover: {
      '&:hover': {
        textDecoration: 'none',
      },
    },
  },

  // "Input"
  MuiInputBase: {
    root: {
      height: '45px',

      backgroundColor: mono.white,
    },
    multiline: {
      height: 'unset',
    },
  },

  MuiFormControl: {
    root: {
      margin: '10px 0 5px 0',
      // width: '350px',
    },
  },
  MuiFormControlLabel: {
    root: {
      marginLeft: '0px',
    },
  },
  MuiSelect: {
    outlined: {
      padding: '10px 0px 10px 15px',
      alignItems: 'center',
    },
    selectMenu: {
      // height: '1.1876em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  MuiSwitch: {
    root: {
      height: '28px',
      width: '48px',
      marginRight: '16px',
      padding: '0px',
    },
    track: {
      height: '15px',
      width: '40px',
      margin: '6.5px 4px 6.5px 4px',
    },
    thumb: {
      height: '22px',
      width: '22px',
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.35)',
      padding: '0px',
      transform: 'translateX(3px) translateY(3px)',
    },
    switchBase: {
      height: '22px',
      width: '22px',
      padding: '0px',
      color: mono.veryLightGray,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    colorPrimary: {
      '&$checked': {
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
  // Base of "List"
  MuiPopover: {
    paper: { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)' },
  },

  MuiMenuItem: {
    root: {
      paddingTop: '12px',
      paddingBottom: '12px',
      borderRadius: '10px',
      height: '45px',
    },
  },
  MuiTextField: {
    root: {
      width: '350px',
    },
  },
  MuiOutlinedInput: {
    root: {
      '& $notchedOutline': {
        // borderRadius: 10,
      },
      '&:hover:not($disabled):not($focused):not($error) $notchedOutline': { borderColor: mono.gray }, // removes hover effect

      '& input': {
        padding: '10px 0px 10px 15px',
        fontWeight: 500,
        fontSize: '1rem',
      },
    },
    multiline: {
      padding: '10px 0px 10px 15px',
      fontWeight: 500,
      fontSize: '1rem',
    },
  },
  MuiFormHelperText: {
    root: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '5px',
      '& p': {
        marginLeft: '8px',
      },
    },
  },
  MuiInputLabel: {
    outlined: {
      transform: 'translate(15px, 13px) scale(1)',
      '&$shrink': { transform: 'translate(14px, -20px) scale(0.89)', fontWeight: 400 },
    },
  },
  MuiRadio: {
    root: {
      display: 'flex',
      padding: '4px',
      '&:hover': {
        backgroundColor: mono.lightGray,
      },
      '&:active': {
        backgroundColor: mono.gray,
      },
    },
    colorSecondary: {
      '&$checked': {
        display: 'flex',
        padding: '4px',
        '&:hover': {
          backgroundColor: mono.lightGray,
        },
        '&:active': {
          backgroundColor: mono.gray,
        },
      },
    },
  },

  // Table
  MuiTableRow: {
    hover: {
      '&:hover': {
        backgroundColor: `${mono.veryLightGray} !important`,
      },
    },
  },

  MuiPaper: {
    // elevation: {  },
    outlined: {
      border: `1px solid ${palette.grey[300]}`,
    },
    rounded: {
      // borderRadius: '10px',
    },
  },

  // Box (dialog)
  MuiDialog: {
    paper: {
      padding: '4px 6px 4px 6px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
    },
    paperWidthMd: { width: '600px' },
    paperWidthSm: { width: '460px' },
  },
  MuiDialogTitle: {
    // root: { padding: '20px 30px 0 30px' },
  },
  MuiDialogContent: {
    // root: { padding: '20px 30px 12px 30px' },
  },
  MuiDialogActions: {
    root: { padding: '0 19px 6px 0' },
  },

  MuiSnackbarContent: {
    root: {
      width: '600px',
      padding: '16px 20px',
      borderRadius: '12px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
      backgroundColor: mono.black,

      // message : body1
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 25 / 18,
      // letterSpacing: '-0.01rem',
      color: mono.white,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      minHeight: '25px',
      padding: '0px',
    },
    action: {
      marginRight: '21px',
      paddingLeft: '0px',
    },
  },

  // "Mask"
  MuiBackdrop: {
    root: {
      backgroundColor: `${palette.grey[300]}66`, // 8-digit hex for opacity = 40%
    },
  },
};

const props = {
  // This includes List items, icon buttons, etc.
  MuiButtonBase: {
    disableRipple: true,
  },

  // Name of the component ⚛️
  MuiButton: {
    variant: 'contained',
    disableElevation: true,
  },

  MuiIconButton: {
    size: 'small',
  },

  MuiSvgIcon: {
    fontSize: 'small',
  },

  MuiFormControl: {
    variant: 'outlined',
  },

  MuiList: {
    disablePadding: true,
  },

  MuiMenu: {
    // make sure the popover is under the input (MUI default: over the input component)
    getContentAnchorEl: null,
    anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
    transformOrigin: { vertical: 'top', horizontal: 'left' },
  },

  MuiTextField: {
    variant: 'outlined',
    // style: { width: 350 },
  },

  MuiOutlinedInput: {
    notched: false,
  },

  MuiFormHelperText: {
    component: ErrorText,
  },

  MuiDialogTitle: {
    disableTypography: true,
  },
};

const headerStyle = {
  background: mono.black,
  color: mono.white,
  activeColor: palette.primary.main,
};

const theme = createTheme({
  palette,
  typography,
  shape,
  overrides,
  props,
  headerStyle,
});

export default responsiveFontSizes(theme);
