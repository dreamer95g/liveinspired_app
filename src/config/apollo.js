//url base del proyecto
import { url_base } from "./app";

import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: `${url_base}graphql`,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export const apollo_client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
