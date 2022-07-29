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
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

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
    display:'flex'
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
  },
  likeIcon: { fontSize: "1.4em", display: "flex", alignItems: "center" },
  likeIconText: {
    color: "#626F84",
  fontSize: "1rem",
  paddingTop: "5px",
  paddingLeft: "6px"
  },
  button: { padding: '5px 15px', textTransform: 'none', width: '15%' },
 snackbarContent:{width:'25rem',fontSize:'16px'} 
}));

const styles = {
  card: { alignItems: 'flex-start', paddingTop: '12px', width:'80%'},
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

export default function TabComp({myPosts, userid= null, postsRefresh ,setPostsRefresh}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [errors, setErrors] = useState(false);
  const currentUser = getCurrentUserDetails();
  const [open, setOpen] = React.useState(true);

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
           setPostsData([...result])
        } 
        setLoading(false);
      },

      onError: (err) => {
        setLoading(false);
        setOpen(true);
        setErrors(true);
        console.error(err);
        sendDataToSentry({
          name: 'Posts',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
        
      },

      fetchPolicy: 'network-only',
     }
  );

  const [editPostMutation] = useMutation(  
    mutationQueries.Update_Post_Details,
    {
      onCompleted: (res) => {
        console.log(res);
        setErrors(false);
        setPostsRefresh(!postsRefresh);
      },
      onError: (err) => {
        setErrors(true);
        setLoading(false);
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
  const editPost = async (requiredParams) => {
    
    
    setLoading(true);
    await editPostMutation(
          {
            variables: {
              postid: requiredParams.postid,
              changes: {
                posttext: requiredParams.postText,
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
        setErrors(false);
        setPostsRefresh(!postsRefresh);
      },
      onError: (err) => {
        setErrors(true);
        setLoading(false);
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
        setErrors(false);
         setPostsRefresh(!postsRefresh);
      },
      onError: (err) => {
        setErrors(true);
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
        setErrors(false);
         setPostsRefresh(!postsRefresh);
      },
      onError: (err) => {
        setErrors(true);
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
      setErrors(true);
      sendDataToSentry({
          name: 'Posts',
          message: err.message,
          tags: { severity: 'CRITICAL' },
          extra: [{ type: 'errorEncounter', err }],
        });
}
  
  }

  React.useEffect(() => {
    let ignore = false;
    getPost();
    return () => {
      ignore = true;
    }
  }, [myPosts, postsRefresh])
  console.log(postsData,errors)

  return (
    <div className={classes.root}>
      {loading && <Loader />}
      <Paper elevation={0} className={classes.paperRoot}>
        
        {checkValidArray(postsData) ? postsData.map((post,index) => {

          const likesCount = post?.allLikes?.countNode?.count ?? 0;
          const isCurrentUserLiked = Boolean(post?.mylike?.likeid);
          let displayLikesCount = isCurrentUserLiked ? `You and ${likesCount - 1} other(s) liked this post` : `${likesCount} people liked this post`

          if (isCurrentUserLiked && likesCount - 1 < 1)
            displayLikesCount = 'You liked this post';
          const postedOn = DateFormatter(post?.postedon)?.split(',');
          const deleteAndEditable = myPosts || currentUser.userid == post.userid;
          const likeIcon='👍'

          return (
            <Card className={classes.cardRoot}>
            <div key={index } className={classes.cardContainer}>
              <div key={index+1 }>
                <div key={index+2} className={classes.profileCard}>
                  <ProfileCard
                    header={post.postedby}
                    userName={post.postedby}
                    subHeader={post.email}
                    postedOn={{keyName:'Posted on : ', date:postedOn?.[0], time:postedOn?.[1]}}
                    styles={{
                      card:styles.card,
                      avatar: styles.avatar,
                      headerTypo: styles.headerTypo,
                      subHeaderTypo: styles.subHeaderTypo,
                      headerGridDiv: styles.headerGridDiv,
              }}
                  />
                  {likesCount > 0 && <div className={classes.likeIcon}>{likeIcon}<span className={classes.likeIconText}>{ `+${likesCount}`}</span></div>}
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
                <Button className={classes.button} size="small" variant="outlined" color="primary" onClick={() => { isCurrentUserLiked ?  deleteLike(post.postid) : addLike(post.postid) }}>
                  {isCurrentUserLiked ? 'Unlike' : 'Like'}
                </Button>
                {deleteAndEditable && (
                    <Button className={classes.button} size="small" variant="outlined" color="primary" onClick={()=>deletePost(post.postid)}>
                      Delete post
                    </Button>
                  )}
                  {deleteAndEditable && (<DialogBox buttonName="Edit post" textFieldValue={post?.posttext}
                    postsRefresh={postsRefresh} setPostsRefresh={setPostsRefresh} mutationCallback={editPost}
                    requiredParams={{ postid: post.postid, postText: post?.posttext }} />)}
              </CardActions>
            </div>
          </Card>)
        }) :
          (!loading &&
            <Card className={classes.cardRoot}><div className={classes.noPostsContainer}>No posts</div></Card>)}
        
        {errors &&
          (<Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <div className={classes.snackbarContent}>
        <Alert onClose={handleClose} severity="error">
          Something went wrong
            </Alert>
            </div>
      </Snackbar>)}
      </Paper>
    </div>
  );
}