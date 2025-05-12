import { IncomingMessage, ServerResponse } from 'http';
import { users } from '../db/users';
import { validate as isValidUUID, v4 as uuidv4 } from 'uuid';
import { parseRequestBody } from '../utils/bodyParser';
import { User } from '../models/user.model';

export const deleteUserById = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid UUID' }));
    return;
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `User with id ${userId} not found` }));
    return;
  }

  users.splice(userIndex, 1);
  res.writeHead(204);
  res.end();
};

export const updateUserById = async (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid UUID' }));
    return;
  }

  const userIndex = users.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: `User with id ${userId} not found` }));
    return;
  }

  try {
    const body = await parseRequestBody(req);
    const { username, age, hobbies } = body;

    if (
      !username ||
      typeof username !== 'string' ||
      typeof age !== 'number' ||
      !Array.isArray(hobbies) ||
      !hobbies.every((h) => typeof h === 'string')
    ) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: 'Missing or invalid required fields' }),
      );
      return;
    }

    const updatedUser: User = {
      id: userId,
      username,
      age,
      hobbies,
    };

    users[userIndex] = updatedUser;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(updatedUser));
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid JSON body' }));
  }
};

export const createUser = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await parseRequestBody(req);

    //TODO: fix typing later
    const { username, age, hobbies } = body;

    if (
      !username ||
      typeof username !== 'string' ||
      typeof age !== 'number' ||
      !Array.isArray(hobbies) ||
      !hobbies.every((h) => typeof h === 'string')
    ) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({ message: 'Missing or invalid required fields' }),
      );
      return;
    }

    const newUser: User = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };

    users.push(newUser);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(newUser));
  } catch (error) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid JSON body' }));
  }
};

export const getUserById = (
  req: IncomingMessage,
  res: ServerResponse,
  userId: string,
) => {
  if (!isValidUUID(userId)) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Invalid UUID' }));
    return;
  }

  const user = users.find((u) => u.id === userId);

  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'User not found' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(user));
};

export const getAllUsers = (_req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(users));
};
