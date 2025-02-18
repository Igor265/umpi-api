import {Transaction} from "@prisma/client";
import {TransactionsRepository} from "@/repositories/transactions-repository";
import {TransactionNotFoundError} from "@/services/errors/transaction-not-found-error";

interface TransactionServiceRequest {
  amount: number
  currency: string
  payment_method: string
  description: string
  customer: {
    name: string
    email: string
  }
}

interface TransactionServiceResponse {
  transaction: Transaction
}

export class TransactionService {

  constructor(private transactionRepository: TransactionsRepository) {}

  async post(data: TransactionServiceRequest): Promise<TransactionServiceResponse> {

    const transaction = await this.transactionRepository.create({
      amount: data.amount,
      currency: data.currency,
      payment_method: data.payment_method,
      description: data.description,
      customer_name: data.customer.name,
      customer_email: data.customer.email
    });

    return {transaction};
  }

  async get(id: number): Promise<TransactionServiceResponse> {

    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    return {transaction};
  }

  async refund(id: number): Promise<TransactionServiceResponse> {

    const transaction = await this.transactionRepository.refund(id);

    if (!transaction) {
      throw new TransactionNotFoundError();
    }

    return {transaction};
  }

  async hopySlit(data: Record<string, any>) {
    const transaction = await this.transactionRepository.hopySlit(data);
  }
}
