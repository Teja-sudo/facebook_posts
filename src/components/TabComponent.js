import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Loader from './Loader';
import ProfileCard from './ProfileCard';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DialogBox from './DialogBox';

const useStyles = makeStyles((theme) => ({
  root: {
  },
  paperRoot: {
    maxWidth:'50rem',
     position: "absolute",
  top: "100px !important",
  left: "110px"
  },
  cardActionsRoot: {
    justifyContent:'space-around'
  },
  profileCard: {
    marginLeft: '2rem',
    marginTop:'1.5rem'
  },
  cardContent: {
    marginLeft: '1.1rem',
    marginTop:'1rem'
  }
}));

export default function TabComp(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);


  return (
    <div className={classes.root}>
      {loading && <Loader />}
      <Paper elevation={1} className={classes.paperRoot}>
         <Card className={classes.root}>
          <div >
            <div className={classes.profileCard}>
        <ProfileCard
           header={'name'}
              postedOn={'user.email'}
              
              />
              </div>
        <CardContent className={classes.cardContent}>
          <Typography gutterBottom variant="h5" component="h2">
            Post text
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography>
        </CardContent>
      </div>
      <CardActions className={classes.cardActionsRoot}>
        <Button size="small" color="primary">
          Like
        </Button>
        <Button size="small" color="primary">
          Delete post
            </Button>
            <DialogBox buttonName="Edit post"/>
      </CardActions>
    </Card>
      </Paper>
    </div>
  );
}