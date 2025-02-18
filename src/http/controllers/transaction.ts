import { FastifyRequest, FastifyReply } from 'fastify';
import {z} from "zod";
import {InvalidCredentialsError} from "@/services/errors/invalid-credentials-error";
import {makeTransactionService} from "@/services/factories/make-transaction-service";
import {TransactionNotFoundError} from "@/services/errors/transaction-not-found-error";

export async function transaction(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify();

  const customerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format")
  });

  const transactionsBodySchema = z.object({
    amount: z.number().min(0, "Amount must be a positive number"),
    currency: z.string().length(3, "Currency must be 3 characters").regex(/^[A-Z]+$/, "Currency should be in uppercase"),
    payment_method: z.enum(["credit_card", "boleto", "pix"]),
    description: z.string().min(1, "Description is required"),
    customer: customerSchema
  });

  const transactionData = transactionsBodySchema.parse(request.body);

  try {
    const transactionService = makeTransactionService();
    const { transaction } = await transactionService.post(transactionData);


    return reply.status(200).send({
      transaction_id: transaction.transaction_id,
      status: transaction.status,
      created_at: transaction.created_at
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

interface Params {
  id: number;
}

export async function getById(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
  await request.jwtVerify();

  const transactionId = request.params.id;

  try {
    const transactionService = makeTransactionService();
    const { transaction } = await transactionService.get(transactionId);

    return reply.status(200).send({
      transaction_id: transaction.transaction_id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      customer: {
        name: transaction.customer_name,
        email: transaction.customer_email
      },
      created_at: transaction.created_at,
      updated_at: transaction.updated_at
    });
  } catch (err) {
    if (err instanceof TransactionNotFoundError) {
      reply.status(400).send({
        message: err.message,
      });
    }
    throw err;
  }
}

export async function refund(request: FastifyRequest<{ Params: Params }>, reply: FastifyReply) {
  await request.jwtVerify();

  const transactionId = request.params.id;

  try {
    const transactionService = makeTransactionService();
    const { transaction } = await transactionService.refund(transactionId);

    return reply.status(200).send({
      transaction_id: transaction.transaction_id,
      status: transaction.status,
      refunded_at: transaction.refunded_at
    });
  } catch (err) {
    if (err instanceof TransactionNotFoundError) {
      reply.status(400).send({
        message: err.message,
      });
    }
    throw err;
  }
}

export async function hopySlit(request: FastifyRequest, reply: FastifyReply) {
  const payload: Record<string, any> = request.body as Record<string, any>;

  try {
    const transactionService = makeTransactionService();
    await transactionService.hopySlit(payload);
    return reply.status(200).send();
  } catch (err) {
    throw err;
  }
}
