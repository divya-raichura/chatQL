import { ApolloClient, InMemoryCache, HttpLink, split } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

// backend url
const DOMAIN = "https://chatql-production.up.railway.app/graphql";
const WSS = "wss://chatql-production.up.railway.app/graphql/subscriptions";
const LOCALHOST_DOMAIN = "http://localhost:4000/graphql";
const LOCALHOST_WSS = "ws://localhost:4000/graphql/subscriptions";

const httpLink = new HttpLink({
  uri: DOMAIN,
  credentials: "include",
});

const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: WSS,
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
