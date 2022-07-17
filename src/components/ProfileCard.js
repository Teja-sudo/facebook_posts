import React from 'react';
import { Typography, Avatar, Grid, makeStyles, Badge } from '@material-ui/core';
import { deepOrange } from '@material-ui/core/colors';

import PropTypes from 'prop-types';
// const props = {
//   avatar: {
//     src: 'https://picsum.photos/id/1027/2848/4272',
//     // alt: '',
//     // width: '65px',
//     // height: '65px',
//   },
//   header: 'Sophia',
//   // subHeader: 'Sophia12345@gmail.com',
//   // headerChip: 'Student',
// };

function ProfileCard(props) {
  const {
    header,
    avatar,
    subHeader,
    headerChip,
    userName,
    status,
    postedOn,
    styles: customStyles,
  } = props;
  let defaultAvatar = userName?.trim().split(' ');
  const userNameLength = defaultAvatar?.length;
  defaultAvatar =
    userNameLength > 1
      ? defaultAvatar[0][0] + defaultAvatar[userNameLength - 1][0]
      : userName?.[0];

  const useStyles = makeStyles((theme) => ({
    card: {
      width: '100%',
      ...customStyles?.card,
    },
    avatar: {
      height: props?.avatar?.height ?? '42px',
      width: props?.avatar?.width ?? '42px',
      fontSize: '17px',
      letterSpacing: '1px',
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      ...customStyles?.avatar,
    },
    avatarItem: {
      display: 'flex',
      alignItems: 'center',
      ...customStyles?.avatarItem,
    },
    headerGrid: {
      display: 'flex',
      alignItems: 'center',
      ...customStyles?.headerGrid,
    },
    headerGridDiv: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: '20px',
      ...customStyles?.headerGridDiv,
    },
    headerGridContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      ...customStyles?.headerGridContainer,
    },
    headerTypo: {
      marginRight: '10px',
      fontWeight: '600',
      color: '#0F1627',
      ...customStyles?.headerTypo,
    },
    active: {
      color: status?.value === 'Active' ? '#79b779' : '#cb4141',
      fontSize: '12px',
      marginLeft: '6px',
    },
    statusWrapper: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '4px',
    },
    subHeaderTypo: { color: '#626F84', ...customStyles?.subHeaderTypo },
    subHeader: {
      marginTop: '4px',
      fontSize: '12px',
      ...customStyles?.subHeader,
    },
    postedOn: {
      marginTop: '4px',
      ...customStyles?.postedOn,
    },
    postedOnTypo: {
      color: '#677489',
      fontSize: '12px',
      ...customStyles?.postedOnTypo,
    },
  }));
  const classes = useStyles();

  return (
    <Grid container className={classes.card}>
      <Grid item className={classes.avatarItem}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={avatar?.badge}
        >
          {avatar?.src ? (
            <Avatar
              className={classes.avatar}
              src={props?.avatar?.src}
              alt={props?.avatar?.alt}
            />
          ) : (
            <Avatar className={classes.avatar}>
              {defaultAvatar?.toUpperCase()}
            </Avatar>
          )}
        </Badge>
      </Grid>
      {/* {console.log(postedOn)} */}
      <Grid item className={classes.headerGridDiv}>
        <Grid container className={classes.headerGridContainer}>
          <Grid item className={classes.headerGrid}>
            {header ? (
              <Typography className={classes.headerTypo}>{header}</Typography>
            ) : null}

          </Grid>
          {subHeader && (
            <Grid item className={classes.subHeader}>
              <Typography className={classes.subHeaderTypo}>
                {subHeader}
              </Typography>
            </Grid>
          )}
          {postedOn && (
            <Grid item className={classes.postedOn}>
              <Typography className={classes.postedOnTypo}>
                {`${postedOn?.keyName} \xa0 ${postedOn?.date}, ${
                  postedOn?.time ?? ''
                }`}
              </Typography>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProfileCard;
ProfileCard.propTypes = {
  avatar: PropTypes.object,
  subHeader: PropTypes.string,
  userName: PropTypes.string,
  header: PropTypes.string,
  headerChip: PropTypes.string,
  styles: PropTypes.object,
  postedOn: PropTypes.object,
};
