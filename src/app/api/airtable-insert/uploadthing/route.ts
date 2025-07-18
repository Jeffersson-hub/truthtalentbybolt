// src/app/api/airtable-insert/uploadthing/route.ts
import { createRouteHandler } from "uploadthing/next";
import { OurFileRouter } from "./core";
// import { utapi } from "../../../../../backend"; 

export const { GET, POST } = createRouteHandler({
  router: OurFileRouter,
});

