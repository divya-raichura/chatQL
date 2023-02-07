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
import { GraphQLContext, Session } from "./util/types";
import { PrismaClient } from "@prisma/client";

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

  // Context parameters
  const prisma = new PrismaClient({ log: ["query"] });

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
        const session = (await getSession({ req })) as Session;
        // now though we added new properties to session in the next-auth frontend and it will be recieved by
        // this session object, but typescript will not know about it, so we need to add a custom type for it
        // hence we made a new interface called Session in types.ts and we will use it here by typecasting
        return { session, prisma };
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
