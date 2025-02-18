import {hash} from "bcryptjs";
import {UsersRepository} from "@/repositories/users-repository";
import {UserAlreadyExistsError} from "@/services/errors/user-already-exists-error";
import {User} from "@prisma/client";

interface RegisterServiceRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterServiceResponse {
  user: User
}

export class RegisterService {

  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterServiceRequest): Promise<RegisterServiceResponse> {

    const userWithSameEmail = await this.usersRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hash = await hash(password, 6);

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash
    });

    return {user};
  }
}
