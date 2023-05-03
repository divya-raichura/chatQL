// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import { PubSub } from "graphql-subscriptions";
import bodyParser from "body-parser";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./graphql/type-defs/index";
import resolvers from "./graphql/resolvers/index";
import dotenv from "dotenv";
import { getSession } from "next-auth/react";
import { GraphQLContext, Session, SubscriptionContext } from "./util/types";
import { PrismaClient } from "@prisma/client";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";

const main = async () => {
  const PORT = process.env.PORT || 4000;
  // backend url
  const SERVER = process.env.SERVER || "http://localhost";

  // client url
  const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:3000";

  dotenv.config();

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  // Required logic for integrating with Express
  const app = express();
  // Our httpServer handles incoming requests to our Express app.
  // Below, we tell Apollo Server to "drain" this httpServer,
  // enabling our servers to shut down gracefully.
  const httpServer = http.createServer(app);

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", CLIENT_ORIGIN);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
  });

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: "/graphql/subscriptions",
  });

  // Context parameters
  const prisma = new PrismaClient();
  const pubsub = new PubSub();

  const getSubscriptionContext = async (
    ctx: SubscriptionContext
  ): Promise<GraphQLContext> => {
    ctx;
    // ctx is the graphql-ws Context where connectionParams live
    if (ctx.connectionParams && ctx.connectionParams.session) {
      const { session } = ctx.connectionParams;
      return { session, prisma, pubsub };
    }
    // Otherwise let our resolvers know we don't have a current user
    return { session: null, prisma, pubsub };
  };

  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        // This will be run every time the client sends a subscription request
        // Returning an object will add that information to our
        // GraphQL context, which all of our resolvers have access to.
        return getSubscriptionContext(ctx);
      },
    },
    wsServer
  );

  // Same ApolloServer initialization, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  // Ensure we wait for our server to start
  await server.start();

  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true, // to allow server to accept auth headers
  };

  // Set up our Express middleware to handle CORS, body parsing,
  // and our expressMiddleware function.
  app.use(
    "/",
    cors<cors.CorsRequest>(corsOptions),
    bodyParser.json(),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      // req obj contains auth headers that next will sent to context
      context: async ({ req }): Promise<GraphQLContext> => {
        // means we return a promise that resolves to a GraphQLContext, so context always has a session as we defined in types.ts(GraphQLContexts)
        // what we return from here will be available in context in resolvers
        const session = (await getSession({ req })) as Session;
        console.log("SESSION", session);
        // console.log("REQUEST", req);
        // console.log("SESSION", session);
        // console.log("SESSION", await getSession({ req }));
        // now though we added new properties to session in the next-auth frontend and it will be recieved by
        // this session object, but typescript will not know about it, so we need to add a custom type for it
        // hence we made a new interface called Session in types.ts and we will use it here by typecasting
        return { session, prisma, pubsub };
      },
    })
  );

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  console.log(`🚀 Server ready at ${SERVER}:${PORT}/`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
