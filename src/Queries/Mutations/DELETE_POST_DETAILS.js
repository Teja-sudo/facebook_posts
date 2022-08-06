import { gql } from '@apollo/client';

export const Delete_Posts_Details = gql`
mutation delete_post($postid: Int!) {
  delete_posts(where: {postid: {_eq: $postid}}) {
    affected_rows
  }
}
`;
//  variables
// {
//   "postid": 3
// }