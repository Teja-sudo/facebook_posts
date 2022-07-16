import { gql } from '@apollo/client';

export const Insert_Post_Details = gql`
mutation insert_post_details($object: posts_insert_input!) {
  insert_posts_one(object: $object) {
    postid
    userid
    email
    postedby
    postedon
    posttext
  }
}
`;

// {
//   "object": {
//     "posttext":  "testing mutation",
//     "postedby":  "Teja",
//     "userid": 1,
//     "email": "teja@gmail.com",
//     "postedon": new Date().toISOString()
//   }
// }