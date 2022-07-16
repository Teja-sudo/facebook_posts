import { gql } from '@apollo/client';

export const GET_Account_Details = gql`
 query GET_Account_Details($email: String, $password: String) {
  connection: accounts(where: {password: {_eq: $password}, email: {_eq: $email}}) {
    userid
    email
    username
    createdon
    password
  }
}
`;



