import {FastifyInstance} from "fastify";
import {register} from "@/http/controllers/register";
import {authenticate} from "@/http/controllers/authenticate";
import {getById, hopySlit, refund, transaction} from "@/http/controllers/transaction";

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register);
  app.post('/sessions', authenticate);
  app.post('/transactions', transaction);
  app.get('/transactions/:id', getById);
  app.post('/transactions/:id/refund', refund);
  app.post('/webhooks/hopysplit', hopySlit);
}