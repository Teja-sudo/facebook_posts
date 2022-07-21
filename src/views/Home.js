import { Grid } from '@material-ui/core'
import React from 'react'
import ProfileCard from '../components/ProfileCard'
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import { getCurrentUserDetails } from '../utils/reusableFunctions';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import TabComponent from '../components/TabComponent.js';
import DialogBox from '../components/DialogBox';
import { useMutation } from '@apollo/client';
import {Insert_Post_Details} from '../Queries/Mutations/INSERT_POST_DETAILS'
import Loader from '../components/Loader';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
      maxWidth: "35rem",
    padding: "100px 0",
    [theme.breakpoints.down("sm")]: {
      padding: "0 50px",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "0 16px",
      backgroundImage: "none",
    },
  },
  
  tabsContainer: {
    '& .MuiTabs-flexContainer':{ justifyContent:'space-around' }
  },
  tabPanelContainer: {
    marginLeft:'30rem'
  },
  container: {
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      padding: "5.6rem 2rem",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "2rem",
    },
  },
  wrapper: {
    background: "#FFFFFF",
    boxShadow: "0px 24px 40px rgba(3, 23, 111, 0.06)",
    padding: "0.7rem",
    alignItems: 'center',
    position: 'fixed',
    zIndex: 1000,
    paddingLeft:'2.5rem'
  },
  logoutButton: {
    background: "#ff3421",
    color: "#FFFFFF",
    fontSize: "1rem",
    fontWeight: "500",
    padding: "0.5rem 1.2rem",
    borderRadius: "8px",
    lineHeight: "24px",
    letterSpacing: "0.02em",

    "&:hover": {
      background: "#d6362b",
    },
    textTransform: "none",
    // width: "30%",
    [theme.breakpoints.down("xs")]: {
      width: "30%",
      padding: "16px 20px",
    },
  },
  
}));

export const styles = {
  card: { justifyContent: 'center' },
  avatar: { height: '52px', width: '52px', fontSize: '26px' },

  headerTypo: {
    fontSize: '16px',
    lineHeight: '15px',
    color: '#42526E',
    marginRight: '0',
    textTransform: 'capitalize',
  },
  subHeaderTypo: {
    fontWeight: '400',
    fontSize: '14px',
    // lineHeight: '18px',
    color: '#939FC0',
  },
  headerGridDiv: {
    marginLeft: '15px',
  },
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
         <div>
          {children}
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function Home() {
  const classes = useStyles();
  const history = useHistory()
  const user = getCurrentUserDetails();
  const [value, setValue] = React.useState(0);
  const [postText, setPostText] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [postsRefresh, setPostsRefresh] = React.useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log(value)
  };

  const logOut = () => {
    localStorage.clear();
    history.push('/')
  }
  
  const [addPostMutation] = useMutation(  
    Insert_Post_Details,
    {
      onCompleted: (res) => {
        console.log(res);
        setPostsRefresh(!postsRefresh);
        setLoading(false)
      },
      onError: (err) => {
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
  const addPost = async (parameters) => {
    
    setLoading(true);
    await addPostMutation(
          {
            variables: {
              object: {
                posttext:  parameters.postText,
                postedby:  user.username,
                userid: user.userid,
                email: user.email,
                postedon: new Date().toISOString()
                }
            }
          })
  }

  return (
    <div>
      <Grid container className={classes.wrapper}>
        <Grid item xs={5}>
        <div className={classes.tabsContainer}>
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        
      >
        <Tab label="All posts" {...a11yProps(0)}/>
        <Tab label="My posts" {...a11yProps(1)}/>
        </Tabs>
          </div>
        </Grid>
        <Grid item xs={2}><DialogBox mutationCallback={addPost} postsRefresh={postsRefresh} setPostsRefresh={setPostsRefresh}/></Grid>
        <Grid item xs={4}>
          <ProfileCard
              header={user.username}
              subHeader={user.email}
              userName={user.username}
            styles={{
                card:styles.card,
                avatar: styles.avatar,
                headerTypo: styles.headerTypo,
                subHeaderTypo: styles.subHeaderTypo,
                headerGridDiv: styles.headerGridDiv,
              }}
          />
        </Grid>
        <Grid item xs={1}>
          <Button
                  variant="contained"
                  size="medium"
                  disableElevation
                  disableRipple
                  className={classes.logoutButton}
                  onClick={logOut}
                >
                  Log out
          </Button>
        </Grid>

      </Grid>

      <Grid container className={classes.tabPanelContainer}>
      <TabPanel value={value} index={0}>
          <TabComponent myPosts={false } postsRefresh={postsRefresh} setPostsRefresh={setPostsRefresh}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
          <TabComponent myPosts={true} userid={user.userid} postsRefresh={postsRefresh} setPostsRefresh={setPostsRefresh} />
      </TabPanel>
      </Grid>
       {loading && <Loader />}
    </div>
  )
}
