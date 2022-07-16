import { gql } from '@apollo/client';

export const Update_Post_Details = gql`
 mutation update_a_post($postid: Int!, $changes: posts_set_input) {
  update_posts_by_pk(
    pk_columns: {postid: $postid}, _set: $changes) {
   postid
  }
}
`;

// variables :
// {
//   "postid": 1,
//   "changes": {
//     "posttext":  "update mutation test",
//     "postedon": new Date().toISOString()
//   }
// }
