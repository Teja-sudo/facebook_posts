import { gql } from '@apollo/client';

export const GET_Posts_Details = gql`query GET_Posts_Details($userid: Int, $postid: Int, $likeduserid: Int) {
  connection: posts(where: {userid: {_eq: $userid}, postid: {_eq: $postid}}, order_by: {postedon: desc}) {
    postid
    userid
    postedby
    postedon
    posttext
    email
    myLike: likedBy(where: {userid: {_eq: $likeduserid}}) {
      userid
    }
    allLikes: likedBy_aggregate {
      countNode: aggregate {
        count(columns: postid)
      }
    }
  }
}
`;

// query MyQuery {
//   posts {
//     userid
//     postid
//     postedby
//     posttext
//     postedon
//     email
//     mylike {
//       likedby
//       likedon
//       likeid
//       postid
//       userid
//     }
//     allLikes_aggregate {
//       aggregate {
//         count(columns: postid)
//       }
//     }
//   }
// }
