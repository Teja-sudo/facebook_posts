import { gql } from '@apollo/client';

export const Delete_Post_Like = gql`
mutation delete_post_likes($postid: Int!, $userid: Int!) {
  delete_postslikes_details(where: {postid: {_eq: $postid}, userid: {_eq: $userid}}) {
    affected_rows
  }
}
`;

// varaibles
// {
//   "postid": 3,
//   "userid": 1
// }