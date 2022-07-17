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
import { useLazyQuery, useMutation } from '@apollo/client';
import * as mutationQueries from '../Queries/Mutations'
import { GET_Posts_Details } from '../Queries/GET_POSTS_DETAILS';
import { GET_Posts_Likes_Details } from '../Queries/GET_POSTS_LIKES_DETAILS';
import { checkValidArray, DateFormatter, getCurrentUserDetails } from '../utils/reusableFunctions';
import { sendDataToSentry } from '../index';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    margin:'2rem 0'
  },
  cardContainer:{margin:'2rem 0'},
  paperRoot: {
    maxWidth: '48rem',
    width:'48rem',
    position: "absolute",
    top: "100px !important",
    left: "110px",
  backgroundColor: 'aliceblue',
  },
  cardActionsRoot: {
    justifyContent:'space-around'
  },
  profileCard: {
    marginLeft: '2rem',
  },
  cardContent: {
    marginLeft: '1.1rem',
    marginTop:'1rem'
  },
  displayLikes: {
  marginTop: '1.5rem'
  },
  noPostsContainer: {
  color: "#939FC0",
  padding: "2rem 2rem",
  fontSize: "5rem",
  fontWeight: 600,
  display: "flex",
  justifyContent: "center"
  }
}));

const styles = {
  card: { alignItems: 'flex-start', paddingTop: '12px' },
  avatar: { height: '62px', width: '62px', fontSize: '26px' },
  headerTypo: {
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '20px',
    color: '#364153',
    textTransform: 'capitalize',
  },
  subHeaderTypo: {
    fontSize: '11px',
    lineHeight: '12px',
    color: '#626F84',
  },
};

export default function TabComp({myPosts,userid=null}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [errors, setErrors] = useState('');
  const currentUser = getCurrentUserDetails();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const [fetchData] = useLazyQuery(   
    GET_Posts_Details,
    { 
      onCompleted: (res) => {
        const result = res?.connection?.nodes;
        console.log(result)
          if(checkValidArray(result)) {
           setPostsData(result)
            setLoading(false);
          } 
      },

      onError: (err) => {
        setLoading(false);
        setErrors('something went wrong');
        console.error(err);
        sendDataToSentry({
          name: 'Posts',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
        return false;
      },

      fetchPolicy: 'network-only',
     }
  );

const [addPostMutation] = useMutation(  
    mutationQueries.Insert_Post_Details,
    {
      onCompleted: (res) => {
        console.log(res);
        getPost(true);
      },
      onError: (err) => {
        console.error(err);
        sendDataToSentry({
          name: 'Posts mutation',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
      },
    }
    );
  const addPost = async (postText = '') => {
    
    setLoading(true);
    await addPostMutation(
          {
            variables: {
              object: {
                posttext:  postText,
                postedby:  currentUser.username,
                userid: currentUser.userid,
                email: currentUser.email,
                postedon: new Date().toISOString()
                }
            }
          })
  }

  const [editPostMutation] = useMutation(  
    mutationQueries.Update_Post_Details,
    {
      onCompleted: (res) => {
        console.log(res);
        getPost(true);
      },
      onError: (err) => {
        console.error(err);
        sendDataToSentry({
          name: 'Posts mutation',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
      },
    }
    );
  const editPost = async (postid, postText = '') => {
    
    
    setLoading(true);
    await editPostMutation(
          {
            variables: {
              postid: postid,
              changes: {
                posttext:  postText,
                postedon: new Date().toISOString()
                  }
            }
          })
  }
  
   const [deletePostMutation] = useMutation(  
    mutationQueries.Delete_Posts_Details,
    {
      onCompleted: (res) => {
        console.log(res);
        getPost(true);
      },
      onError: (err) => {
        console.error(err);
        sendDataToSentry({
          name: 'Posts mutation',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
      },
    }
    );
  const deletePost = async (postid) => {
    
    setLoading(true);
    await deletePostMutation(
          {
            variables: {
              postid:postid
            }
          })
  }

  const [addLikeMutation] = useMutation(  
    mutationQueries.Insert_Post_Like,
    {
      onCompleted: (res) => {
        console.log(res);
        getPost(true);
      },
      onError: (err) => {
        console.error(err);
        sendDataToSentry({
          name: 'Posts mutation',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
      },
    }
    );
  const addLike = async (postid) => {

    setLoading(true);
   await addLikeMutation(
          {
            variables: {
              object: {
                postid: postid,
                likedby:   currentUser.username,
                userid: currentUser.userid,
                likedon: new Date().toISOString()
                }
            }
          })
  }

  const [deleteLikeMutation] = useMutation(  
    mutationQueries.Delete_Post_Like,
    {
      onCompleted: (res) => {
        console.log(res);
        getPost(true);
      },
      onError: (err) => {
        console.error(err);
        sendDataToSentry({
          name: 'Posts mutation',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
      },
    }
    );
  const deleteLike = async (postid) => {
    
    console.log(postid,currentUser.userid)
    setLoading(true);
    await deleteLikeMutation(
          {
            variables: {
              postid: postid,
              userid : currentUser.userid
            }
          })
  }

  const getPost = async (dontsetLoading = false) => {
    if(!dontsetLoading)
      setLoading(true);
    await fetchData({ variables: { userid: userid } })
  }

  const getLikes = (dontsetLoading = false) => {
    const postid= selectedPostDetails?.postid ?? null;
    query = GET_Posts_Likes_Details;
    const { data, error, refetch } = useQuery(GET_Posts_Likes_Details,
      { variables: { userid: currentUser.userid, postid: postid } });
    
    if (error) {
      console.error(error);
      sendDataToSentry({
          name: 'Posts',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
}
  
  }

  React.useEffect(() => {
    let ignore=false
    getPost()
    return () => {
      ignore = true;
    }
  }, [myPosts])
  

  return (
    <div className={classes.root}>

      {loading && <Loader />}
      {errors && (<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errors}
        </Alert>
      </Snackbar>)}

      <Paper elevation={0} className={classes.paperRoot}>
        {checkValidArray(postsData) ? postsData.map((post,index) => {

          const likesCount = post?.allLikes?.countNode?.count ?? 0;
          const isCurrentUserLiked = Boolean(post?.mylike?.likeid);
          console.log(isCurrentUserLiked,post.email)
          let displayLikesCount = isCurrentUserLiked ? `You and ${likesCount - 1} other(s) liked this post` : `${likesCount} people liked this post`
          if (isCurrentUserLiked && likesCount - 1 < 1)
            displayLikesCount = 'You liked this post'
          const postedOn=DateFormatter(post?.postedon)?.split(',')

          return (<Card className={classes.cardRoot}>
            <div key={index } className={classes.cardContainer}>
              <div key={index+1 }>
                <div key={index+2} className={classes.profileCard}>
                  <ProfileCard
                    header={post.postedby}
                    userName={post.postedby}
                    subHeader={post.email}
                    postedOn={{keyName:'Posted on : ', date:postedOn?.[0], time:postedOn?.[1]}}
                    styles={{
                      avatar: styles.avatar,
                      headerTypo: styles.headerTypo,
                      subHeaderTypo: styles.subHeaderTypo,
                      headerGridDiv: styles.headerGridDiv,
              }}
                  />
                </div>
                <CardContent key={index+3} className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Post text
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {post?.posttext ?? '' }
                  </Typography>
                  {likesCount>0 && (<Typography variant="body2" color="textSecondary" component="p" className={classes.displayLikes}>
                    {displayLikesCount }
                  </Typography>)}
                </CardContent>
              </div>
              <CardActions key={index+4} className={classes.cardActionsRoot}>
                <Button size="small" color="primary" onClick={() => { isCurrentUserLiked ?  deleteLike(post.postid) : addLike(post.postid) }}>
                  {isCurrentUserLiked ? 'Unlike' : 'Like'}
                </Button>
                <Button size="small" color="primary" onClick={()=>deletePost(post.postid)}>
                  Delete post
                </Button>
                <DialogBox buttonName="Edit post" />
              </CardActions>
            </div>
          </Card>)
        }) :
          ( !loading && <Card className={classes.cardRoot}><div className={classes.noPostsContainer}>No posts</div></Card>)}
      </Paper>
    </div>
  );
}