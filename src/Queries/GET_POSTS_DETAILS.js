import { gql } from '@apollo/client';

export const GET_Posts_Details = gql`query GET_Posts_Details($userid: Int, $postid: Int) {
  connection: posts_aggregate(where: {userid: {_eq: $userid}, postid: {_eq: $postid}}, order_by: {postedon: desc}) {
    nodes {
      userid
      postid
      posttext
      postedon
      postedby
      email
      mylike {
        likedby
        likedon
        likeid
        postid
        userid
      }
      allLikes: allLikes_aggregate {
        countNode: aggregate {
          count(columns: postid)
        }
      }
    }
  }
}
`;
