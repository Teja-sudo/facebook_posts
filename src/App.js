import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider,createHttpLink,gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import RouteTo from './Route';

const httpLink = createHttpLink({
  uri: 'https://ts-gql-1.hasura.app/v1/graphql',
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


function App() {
  return (
    <ApolloProvider client={client}>
     <RouteTo />
  </ApolloProvider>
  )
};

export default App;
