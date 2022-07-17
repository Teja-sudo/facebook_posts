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
import { checkValidArray, getCurrentUserDetails } from '../utils/reusableFunctions';

const useStyles = makeStyles((theme) => ({
  cardRoot: {
    margin:'2rem 0'
  },
  cardContainer:{margin:'2rem 0'},
  paperRoot: {
    maxWidth:'48rem',
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
  margin: '0.5rem'
  },
  noPostsContainer: {
    fontSize: '5rem',
    maxWidth: '48rem',
    fontWeight:600
  }
}));

export default function TabComp({myPosts,userid=null}) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [postsData, setPostsData] = useState([]);
  const [likesData, setLikesData] = useState([]);
  const [errors, setErrors] = useState('');
  const currentUser = getCurrentUserDetails();
  
  let selectedPostDetails = {};
  let mutationQuery = mutationQueries.Insert_Post_Like;

  const [mutateData] = useMutation(  
    mutationQuery,
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

  const addPost = (postText='') => {
    mutationQuery = mutationQueries.Insert_Post_Details;
    setLoading(true);
    mutateData(
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

  const editPost = (postid,postText='') => {
    mutationQuery = mutationQueries.Update_Post_Details;
    setLoading(true);
    mutateData(
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
  
  const deletePost = (postid) => {
    mutationQuery = mutationQueries.Delete_Posts_Details
    setLoading(true);
    mutateData(
          {
            variables: {
              postid:postid
            }
          })
  }

  const addLike = (postid) => {
    mutationQuery = mutationQueries.Insert_Post_Like
    setLoading(true);
    mutateData(
          {
            variables: {
              object: {
                postid: 1,
                likedby:   currentUser.username,
                userid: currentUser.userid,
                likedon: new Date().toISOString()
                }
            }
          })
  }

  const deleteLike = (postid) => {
    mutationQuery = mutationQueries.Delete_Post_Like;
    setLoading(true);
    mutateData(
          {
            variables: {
              postid: postid,
              userid : currentUser.userid
            }
          })
  }

  const getPost = (dontsetLoading = false) => {
    if(!dontsetLoading)
      setLoading(true);
    fetchData({ variables: { userid: userid } })
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
      <Paper elevation={0} className={classes.paperRoot}>
        {checkValidArray(postsData) ? postsData.map((post) => {

          const likesCount = post?.allLikes?.countNode?.count ?? 0;
          const isCurrentUserLiked = Boolean(post?.mylike?.likeid);
          const displayLikesCount=isCurrentUserLiked ? `You and ${likesCount-1} others liked this post` : `${likesCount-1} people liked this post`

          return (<Card className={classes.cardRoot}>
            <div className={classes.cardContainer}>
              <div >
                <div className={classes.profileCard}>
                  <ProfileCard
                    header={post.postedby}
                    userName={post.postedby}
                    postedOn={post.email}
              
                  />
                </div>
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h5" component="h2">
                    Post text
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p">
                    {post?.postText ?? '' }
                  </Typography>
                  {likesCount>0 && (<Typography variant="body2" color="textSecondary" component="p" className={classes.displayLikes}>
                    {displayLikesCount }
                  </Typography>)}
                </CardContent>
              </div>
              <CardActions className={classes.cardActionsRoot}>
                <Button size="small" color="primary">
                  {isCurrentUserLiked ? 'Unlike' : 'Like'}
                </Button>
                <Button size="small" color="primary">
                  Delete post
                </Button>
                <DialogBox buttonName="Edit post" />
              </CardActions>
            </div>
          </Card>)
        }) :
          (<Card className={classes.cardRoot}><div className={classes.noPostsContainer}>No posts</div></Card>)}
      </Paper>
    </div>
  );
}