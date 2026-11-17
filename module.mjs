// @ts-check
import { module } from "@prisma/composer";
import bizzmakerService from "./service.mjs";

export default module("bizzmaker", ({ provision }) => {
  provision(bizzmakerService);
});
