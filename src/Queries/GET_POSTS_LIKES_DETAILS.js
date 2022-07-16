import { gql } from '@apollo/client';

export const GET_Posts_Details = gql`
  query GET_Posts_Likes_Details($postid: Int, $userid: Int) {
  connection: postslikes_deatails(order_by: {likeid: desc}, where: {userid: {_neq: $userid}, postid: {_eq: $postid}}) {
    userid
    postid
    likeid
    likedby
    likedon
  }
}
`;

