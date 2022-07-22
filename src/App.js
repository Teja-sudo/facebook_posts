import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink,gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import RouteTo from './Route';
import * as Sentry from "@sentry/react";

const httpLink = createHttpLink({
  uri:  process.env.HASURA_GRAPHQL_ADMIN_SECRET,
});
const authLink = setContext((_, { headers }) => {
  const token = process.env.HASURA_GRAPHQL_ADMIN_SECRET_TOKEN;
  return {
    headers: {
      ...headers,
      "x-hasura-admin-secret": token
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
console.log(REACT_APP_HASURA_GRAPHQL_ADMIN_SECRET? 22:'no')

function App() {
  return (
    <ApolloProvider client={client}>
     <RouteTo />
  </ApolloProvider>
  )
};

export default Sentry.withProfiler(App);