import { gql } from '@apollo/client';

export const Insert_Post_Comments = gql`
mutation insert_post_comments($object: postscomments_details_insert_input!) {
  insert_postscomments_details_one(object: $object) {
    commentid
    postid
    commentedby
    comment
    commentedon
    userid
  }
}
`;

// {
//   "object": {
//     "comment": "testing mutation",
//     "commentedby": "Teja",
//     "postid": 1,
//     "userid": 1,
//     "commentedon": new Date().toISOString()
//   }
// }