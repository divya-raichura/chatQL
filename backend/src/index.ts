// npm install @apollo/server express graphql cors body-parser
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import { makeExecutableSchema } from "@graphql-tools/schema";
import typeDefs from "./graphql/type-defs/index";
import resolvers from "./graphql/resolvers/index";
import dotenv from "dotenv";
import { getSession } from "next-auth/react";
import { GraphQLContext } from "./util/types";

const main = async () => {
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

  // Same ApolloServer initialization, plus the drain plugin
  // for our httpServer.
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
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
        const session = await getSession({ req });
        return { session };
      },
    })
  );

  // Modified server startup
  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
