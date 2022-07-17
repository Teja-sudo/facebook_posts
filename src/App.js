import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink,gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import RouteTo from './Route';
import * as Sentry from "@sentry/react";

const httpLink = createHttpLink({
  uri: process.env.HASURA_GRAPHQL_ADMIN_SECRET || 'https://ts-gql-1.hasura.app/v1/graphql',
});
const authLink = setContext((_, { headers }) => {
  const token = 'PjmfMm9F3oNEV6nOY0yy1Tyob4IAjJZwKTtbtvyPiZAjtyjpble17EgdpX1RgW83';
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
console.log(process.env.HASURA_GRAPHQL_ADMIN_SECRET?11:0)

function App() {
  return (
    <ApolloProvider client={client}>
     <RouteTo />
  </ApolloProvider>
  )
};

export default Sentry.withProfiler(App);