import { IncomingMessage, ServerResponse } from "http";
import { users } from "../db/users";

export const getAllUsers = (_req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
};
