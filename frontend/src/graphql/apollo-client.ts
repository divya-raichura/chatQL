import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

const url = "https://chatql.onrender.com";
const wsUrl = "wss://chatql.onrender.com/";

const httpLink = new HttpLink({
  uri: `${url}/graphql}`,
  credentials: "include",
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `${wsUrl}/graphql/subscriptions`,
          connectionParams: async () => ({
            session: await getSession(),
          }),
        })
      )
    : null; // to make sure it's not running on the nextjs server but its running on the browser

const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === "OperationDefinition" &&
            def.operation === "subscription"
          );
        },
        wsLink,
        httpLink
      )
    : httpLink;

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
