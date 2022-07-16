import { gql } from '@apollo/client';

export const Insert_User_Details = gql`
  mutation insert_account_row($object: accounts_insert_input!) {
  updatedData: insert_accounts_one(object: $object) {
    email
    password
    userid
    username
  }
}
`;

// variables:
// {
//   "object": {
//     "email":  "Sample article content",
//     "username":  "",
//     "password": "123"
//   }
// }