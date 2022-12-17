import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

const HomeScreenStyle = styled(Stack)(({theme}) => ({
  width: '100%',
  height: 'inherit',
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  justifyContent: 'center',
  alignItems: 'center',
  gap: '16px',

  '#tbc-icon': {
    width: '4rem',
  },
  '.icon': {
    verticalAlign: 'bottom',
  }
}))

function HomeScreen(props: { id: string }) {
  return (
    <HomeScreenStyle direction='column' id={props.id}>
      <Box
        component='img'
        sx={{
          width: '4rem'
        }}
        src="https://cdn.jsdelivr.net/gh/Deepbluewarn/twitch_badge_collector_web@fcdcd297de5497c3adfad05d0115f41976d12728/src/public/logo/TBC%20400.png"
        alt="tbc_logo"
      >
      </Box>
      <span>Twitch Badge Collector</span>
    </HomeScreenStyle>
  );
}

export default HomeScreen;