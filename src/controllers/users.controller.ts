import { IncomingMessage, ServerResponse } from "http";
import { users } from "../db/users";
import { validate as isValidUUID } from "uuid";

export const getUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string
) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid UUID" }));
    return;
  }

  const user = users.find(u => u.id === userId);

  if(!user) {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({message: 'User not found'}));
    return;
  }

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(user));
};

export const getAllUsers = (_req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users));
};
