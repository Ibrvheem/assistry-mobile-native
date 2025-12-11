const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Mock Data
const BANKS = [
    { code: '044', name: 'Access Bank', logo: 'https://logo.clearbit.com/accessbankplc.com' },
    { code: '058', name: 'Guaranty Trust Bank', logo: 'https://logo.clearbit.com/gtbank.com' },
    { code: '033', name: 'United Bank for Africa', logo: 'https://logo.clearbit.com/ubagroup.com' },
    { code: '011', name: 'First Bank of Nigeria', logo: 'https://logo.clearbit.com/firstbanknigeria.com' },
    { code: '214', name: 'First City Monument Bank', logo: 'https://logo.clearbit.com/fcmb.com' },
    { code: '057', name: 'Zenith Bank', logo: 'https://logo.clearbit.com/zenithbank.com' },
    { code: '032', name: 'Union Bank of Nigeria', logo: 'https://logo.clearbit.com/unionbankng.com' },
    { code: '035', name: 'Wema Bank', logo: 'https://logo.clearbit.com/wemabank.com' },
    { code: '050', name: 'Ecobank Nigeria', logo: 'https://logo.clearbit.com/ecobank.com' },
    { code: '232', name: 'Sterling Bank', logo: 'https://logo.clearbit.com/sterling.ng' },
    { code: '101', name: 'Providus Bank', logo: 'https://logo.clearbit.com/providusbank.com' },
    { code: '215', name: 'Unity Bank', logo: 'https://logo.clearbit.com/unitybankng.com' },
    { code: '070', name: 'Fidelity Bank', logo: 'https://logo.clearbit.com/fidelitybank.ng' },
    { code: '301', name: 'Jaiz Bank', logo: 'https://logo.clearbit.com/jaizbankplc.com' },
    { code: '076', name: 'Polaris Bank', logo: 'https://logo.clearbit.com/polarisbanklimited.com' },
    { code: '221', name: 'Stanbic IBTC Bank', logo: 'https://logo.clearbit.com/stanbicibtc.com' },
    { code: '068', name: 'Standard Chartered Bank', logo: 'https://logo.clearbit.com/sc.com' },
    { code: '100', name: 'SunTrust Bank', logo: 'https://logo.clearbit.com/suntrustng.com' },
    { code: '102', name: 'Titan Trust Bank', logo: 'https://logo.clearbit.com/titantrustbank.com' },
    { code: '999', name: 'OPay', logo: 'https://logo.clearbit.com/opayweb.com' },
    { code: '998', name: 'Kuda Bank', logo: 'https://logo.clearbit.com/kuda.com' },
    { code: '997', name: 'PalmPay', logo: 'https://logo.clearbit.com/palmpay.com' },
    { code: '996', name: 'Moniepoint', logo: 'https://logo.clearbit.com/moniepoint.com' },
];

const MOCK_ACCOUNTS = {
    '1234567890': { name: 'John Doe', bankCode: '058' },
    '0987654321': { name: 'Jane Smith', bankCode: '044' },
    '1122334455': { name: 'Assistry Corp', bankCode: '999' },
};

// 1. Get Banks
app.get('/api/payments/banks', (req, res) => {
    const { search } = req.query;
    if (search) {
        const filtered = BANKS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
        return res.json(filtered);
    }
    res.json(BANKS);
});

// 2. Verify Account
app.get('/api/payments/verify-account', (req, res) => {
    const { account_number, bank_code } = req.query;

    // Simulate network delay
    setTimeout(() => {
        if (account_number === '0000000000') {
            return res.status(404).json({ message: 'Account not found' });
        }

        const mock = MOCK_ACCOUNTS[account_number];
        if (mock) {
            if (mock.bankCode !== bank_code) {
                // Even if account exists, if bank code doesn't match, usually it's not found or name mismatch
                // But for mock simplicity, let's just return a random name if not in our strict map
                return res.json({ account_name: 'Unknown Beneficiary', account_number });
            }
            return res.json({ account_name: mock.name, account_number });
        }

        // Default for unknown numbers
        res.json({ account_name: 'Verified User', account_number });
    }, 1000);
});

// 3. Get Quote (Fee)
app.get('/api/payments/quote', (req, res) => {
    const { amount } = req.query;
    const numAmount = parseFloat(amount);

    let fee = 10;
    if (numAmount > 5000) fee = 25;
    if (numAmount > 50000) fee = 50;

    res.json({
        amount: numAmount,
        fee,
        total: numAmount + fee,
        currency: 'NGN'
    });
});

// 4. Validate PIN
app.post('/api/auth/validate-pin', (req, res) => {
    const { pin } = req.body;
    // Mock PIN is always 1234
    if (pin === '1234') {
        res.json({ valid: true });
    } else {
        res.status(401).json({ valid: false, message: 'Invalid PIN' });
    }
});

// 5. Transfer (Idempotent)
const processedTransactions = new Set();

app.post('/api/payments/transfer', (req, res) => {
    const { idempotencyKey, amount, beneficiary, reference } = req.body;

    if (processedTransactions.has(idempotencyKey)) {
        return res.status(409).json({ message: 'Duplicate transaction detected', status: 'duplicate' });
    }

    // Simulate processing
    setTimeout(() => {
        // Simulate random failure (10% chance)
        if (Math.random() < 0.1) {
            return res.status(500).json({ status: 'failed', message: 'Network error' });
        }

        processedTransactions.add(idempotencyKey);

        res.json({
            status: 'success',
            transaction_id: 'TXN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toISOString(),
            amount,
            beneficiary,
            reference
        });
    }, 2000);
});

app.listen(PORT, () => {
    console.log(`Mock Payments Server running on http://localhost:${PORT}`);
});
