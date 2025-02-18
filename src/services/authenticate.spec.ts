import {expect, describe, it, beforeEach} from 'vitest';
import {InMemoryUsersRepository} from "@/repositories/in-memory/in-memory-users-repository";
import {AuthenticateService} from "@/services/authenticate";
import {hash} from "bcryptjs";
import {InvalidCredentialsError} from "@/services/errors/invalid-credentials-error";

let usersRepository: InMemoryUsersRepository;
let authenticateService: AuthenticateService;

describe('authenticate', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateService = new AuthenticateService(usersRepository);
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'teste@email.com',
      password_hash: await hash('123456', 6)
    });

    const { user } = await authenticateService.execute({
      email: 'teste@email.com',
      password: '123456'
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'teste@email.com',
      password_hash: await hash('123456', 6)
    });

    await expect(() =>
      authenticateService.execute({
        email: 'teste@email.com',
        password: '1234567'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      authenticateService.execute({
        email: 'teste2@email.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
