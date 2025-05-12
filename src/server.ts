import http from "http";
import { handleUserRoutes } from "./routes/user.route";

export const createServer = () => {
  return http.createServer((req, res) => {
    if (!req.url?.startsWith("/api/users")) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Endpoint not found" }));
      return;
    }

    handleUserRoutes(req, res);
  });
};
