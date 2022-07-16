import { gql } from '@apollo/client';

export const GET_Post_Comments_Details = gql`query GET_Posts_Comments_Details($postid: Int) {
  connection: postscomments_details(order_by: {commentedon: desc}, where: {postid: {_eq: $postid}}) {
    userid
    postid
    commentid
    commentedby
    comment
    commentedon
  }
}

`;
