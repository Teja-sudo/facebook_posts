import { makeStyles } from '@material-ui/core';
import loader from './loader.gif';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    padding: theme.spacing(2.5),
    width: '50%',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 99999999
  },
  img: {
    top: '34% !important',
    left: '20% !important',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '20%',
    zIndex: 99999999
  },
}));

export default function Loader() {
    const classes = useStyles(); 

  return (
    <div className={classes.root}>
      <img src={loader} alt="Loader" className={classes.img} />
    </div>
  );
}
