import { FastifyRequest, FastifyReply } from 'fastify';
import {z} from "zod";
import {InvalidCredentialsError} from "@/services/errors/invalid-credentials-error";
import {makeAuthenticateService} from "@/services/factories/make-authenticate-service";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateService = makeAuthenticateService();
    const { user } = await authenticateService.execute({email, password});

    const token = await reply.jwtSign({}, {
      sign: {
        sub: user.id,
      }
    });

    return reply.status(200).send({
      token,
    });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      reply.status(400).send({
        message: err.message,
      });
    }
    throw err;
  }
}