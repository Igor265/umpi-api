import {PrismaUsersRepository} from "@/repositories/prisma/prisma-users-repository";
import {RegisterService} from "@/services/register";

export function makeRegisterService() {
  const usersRepository = new PrismaUsersRepository();
  return new RegisterService(usersRepository);
}