import { IncomingMessage, ServerResponse } from "http";
import { getAllUsers } from "../controllers/users.controller";

export const handleUserRoutes = (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url || "";
  const method = req.method;

  if (url === "/api/users" && method === "GET") {
    return getAllUsers(req, res);
  }

  //If no matching
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Route not found" }));
};
