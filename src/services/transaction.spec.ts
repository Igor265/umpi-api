import {expect, describe, it, beforeEach} from 'vitest';
import {InMemoryTransactionsRepository} from "@/repositories/in-memory/in-memory-transactions-repository";
import {TransactionService} from "@/services/transaction";
import {TransactionNotFoundError} from "@/services/errors/transaction-not-found-error";

let transactionRepository: InMemoryTransactionsRepository;
let transactionService: TransactionService;

describe('transaction', () => {
  beforeEach(() => {
    transactionRepository = new InMemoryTransactionsRepository()
    transactionService = new TransactionService(transactionRepository);
  })

  it('should be able to create a transaction', async () => {
    const { transaction } = await transactionService.post({
      amount: 150.00,
      currency: "BRL",
      payment_method: "credit_card",
      description: "Serviço de assinatura",
      customer: {
        name: "Maria Silva",
        email: "maria.silva@example.com"
      }
    });

    expect(transaction.id).toEqual(expect.any(Number));
  });

  it('should be able to find a transaction by the id', async () => {
    await transactionRepository.create({
      amount: 150.00,
      currency: "BRL",
      payment_method: "credit_card",
      description: "Serviço de assinatura",
      customer_name: "Maria Silva",
      customer_email: "maria.silva@example.com",
    });

    const { transaction } = await transactionService.get(1);

    expect(transaction.id).toEqual(expect.any(Number));
  });

  it('should not be able to find a transaction with wrong id', async () => {
    await expect(() =>
      transactionService.get(1)
    ).rejects.toBeInstanceOf(TransactionNotFoundError);
  });

  it('should be able to refund a transaction', async () => {
    await transactionRepository.create({
      amount: 150.00,
      currency: "BRL",
      payment_method: "credit_card",
      description: "Serviço de assinatura",
      customer_name: "Maria Silva",
      customer_email: "maria.silva@example.com",
    });

    const { transaction } = await transactionService.refund(1);

    expect(transaction.status).toEqual("REFUNDED");
  });

  it('should not be able to refund a transaction with wrong id', async () => {
    await expect(() =>
      transactionService.refund(1)
    ).rejects.toBeInstanceOf(TransactionNotFoundError);
  });
});
