
import { gql } from '@apollo/client';

export const Insert_Post_Like = gql`
 mutation insert_post_like($object: postslikes_details_insert_input!) {
  updatedData: insert_postslikes_details_one(object: $object) {
    postid
    userid
    likedby
    likeid
    likedon
  }
}
`;

// {
//   "object": {
//     "postid": 1,
//     "likedby":   "Teja",
//     "userid": 1
//     "likedon": new Date().toISOString()
//   }
// }