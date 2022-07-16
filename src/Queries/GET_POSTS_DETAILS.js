import { gql } from '@apollo/client';

export const GET_Posts_Details = gql`
  query GET_Posts_Details($userid: Int, $postid: Int) {
    connection: posts(
      order_by: { postedon: desc }
      where: { userid: { _eq: $userid }, postid: { _eq: $postid } }
    ) {
      postid
      userid
      postedby
      posttext
      postedon
      email
      mylike {
        userid
        likeid
        postid
        likedby
        likedon
      }
    }
  }
`;
