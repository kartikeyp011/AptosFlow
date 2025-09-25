module SmartPay::SmartPay {
    use std::signer;
    use std::vector;
    use std::string;

    // -----------------------------
    // 1. Test Token
    // -----------------------------
    resource struct Token {
        value: u64,
    }

    // Store Token under account
    public fun mint(account: &signer, amount: u64) {
        let token = Token { value: amount };
        move_to(account, token);
    }

    public fun transfer(sender: &mut Token, amount: u64) {
        assert!(sender.value >= amount, 1);
        sender.value = sender.value - amount;
    }

    public fun balance(token: &Token): u64 {
        token.value
    }

    // -----------------------------
    // 2. Recurring Payments
    // -----------------------------
    resource struct RecurringPayment {
        payee: address,
        amount: u64,
        interval_seconds: u64,
        next_payment_time: u64,
    }

    public fun schedule_payment(
        account: &signer,
        payee: address,
        amount: u64,
        interval_seconds: u64,
        current_time: u64
    ): RecurringPayment {
        RecurringPayment {
            payee,
            amount,
            interval_seconds,
            next_payment_time: current_time + interval_seconds,
        }
    }

    public fun execute_payment(rp: &mut RecurringPayment, current_time: u64) {
        assert!(current_time >= rp.next_payment_time, 2);
        rp.next_payment_time = current_time + rp.interval_seconds;
    }

    // -----------------------------
    // 3. Payment Splits
    // -----------------------------
    resource struct SplitPayment {
        recipients: vector<address>,
        amounts: vector<u64>,
    }

    public fun create_split(
        recipients: vector<address>,
        amounts: vector<u64>
    ): SplitPayment {
        assert!(vector::length(&recipients) == vector::length(&amounts), 3);
        SplitPayment { recipients, amounts }
    }

    public fun execute_split(sender_balance: &mut Token, sp: &SplitPayment) {
        let total: u64 = 0;
        let i = 0;
        while (i < vector::length(&sp.amounts)) {
            let amt = *vector::borrow(&sp.amounts, i);
            total = total + amt;
            i = i + 1;
        }
        assert!(sender_balance.value >= total, 4);
        sender_balance.value = sender_balance.value - total;
    }

    // -----------------------------
    // 4. RWA-backed Assets
    // -----------------------------
    resource struct RWAAsset {
        owner: address,
        value: u64,
        description: string,
    }

    public fun create_rwa(owner: address, value: u64, description: string): RWAAsset {
        RWAAsset { owner, value, description }
    }

    public fun pay_with_rwa(asset: &mut RWAAsset, amount: u64) {
        assert!(asset.value >= amount, 5);
        asset.value = asset.value - amount;
    }
}
