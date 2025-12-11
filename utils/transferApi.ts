const BASE_URL = 'http://localhost:3001/api'; // Use your local IP if testing on device

export interface Bank {
  code: string;
  name: string;
  logo: string;
}

export interface AccountVerification {
  account_name: string;
  account_number: string;
}

export interface Quote {
  amount: number;
  fee: number;
  total: number;
  currency: string;
}

export interface TransferResult {
  status: 'success' | 'pending' | 'failed' | 'duplicate';
  transaction_id?: string;
  date?: string;
  amount?: number;
  beneficiary?: string;
  reference?: string;
  message?: string;
}

export const transferApi = {
  getBanks: async (search?: string): Promise<Bank[]> => {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const res = await fetch(`${BASE_URL}/payments/banks${query}`);
    return res.json();
  },

  verifyAccount: async (accountNumber: string, bankCode: string): Promise<AccountVerification> => {
    const res = await fetch(`${BASE_URL}/payments/verify-account?account_number=${accountNumber}&bank_code=${bankCode}`);
    if (!res.ok) throw new Error('Account verification failed');
    return res.json();
  },

  getQuote: async (amount: number): Promise<Quote> => {
    const res = await fetch(`${BASE_URL}/payments/quote?amount=${amount}`);
    return res.json();
  },

  validatePin: async (pin: string): Promise<boolean> => {
    const res = await fetch(`${BASE_URL}/auth/validate-pin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });
    if (res.status === 401) return false;
    const data = await res.json();
    return data.valid;
  },

  initiateTransfer: async (payload: {
    idempotencyKey: string;
    amount: number;
    beneficiary: string;
    reference: string;
    bankCode: string;
    accountNumber: string;
  }): Promise<TransferResult> => {
    const res = await fetch(`${BASE_URL}/payments/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
