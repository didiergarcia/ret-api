export enum AccountType {
  PRETAX_401K = "PRETAX_401K",
  ROTH_401K = "ROTH_401K",
  TRADITIONAL_IRA = "TRADITIONAL_IRA",
  ROLLOVER_IRA = "ROLLOVER_IRA",
  ROTH_IRA = "ROTH_IRA",
  SEP_IRA = "SEP_IRA",
  SIMPLE_IRA = "SIMPLE_IRA",
  PRETAX_403b = "PRETAX_403b",
  ROTH_403b = "ROTH_403b",
  PRETAX_403b9 = "PRETAX_403b9",
  ROTH_403b9 = "ROTH_403b9",
  HSA = "HSA",
  BROKERAGE = "BROKERAGE",
  SAVINGS = "SAVINGS",
  CHECKING = "CHECKING"
};

export const OPTIONAL_REINVEST_DIVIDEND_ACCOUNTS = [
  AccountType.TRADITIONAL_IRA,
  AccountType.ROLLOVER_IRA,
  AccountType.SEP_IRA,
  AccountType.SIMPLE_IRA,
  AccountType.ROTH_IRA,
  AccountType.BROKERAGE,
  AccountType.HSA,
  AccountType.SAVINGS, // Adding, but really, this should be non-optional.
];

export const CATCHUP_ALLOWED_ACCOUNTS = [
  AccountType.PRETAX_401K,
  AccountType.ROTH_401K,
  AccountType.TRADITIONAL_IRA,
  AccountType.ROLLOVER_IRA,
  AccountType.ROTH_IRA,
  AccountType.SEP_IRA,
  AccountType.SIMPLE_IRA,
  AccountType.PRETAX_403b,
  AccountType.PRETAX_403b9,
];

export const EMPLOYER_MATCH_ACCOUNTS = [
  AccountType.PRETAX_401K,
  AccountType.ROTH_401K,
  AccountType.PRETAX_403b,
  AccountType.PRETAX_403b9,
  AccountType.ROTH_403b,
  AccountType.ROTH_403b9,
];

export const EMPLOYER_CONTRIBUTE_ACCOUNTS = [
  AccountType.SEP_IRA,
  AccountType.SIMPLE_IRA,
  AccountType.PRETAX_401K,
  AccountType.ROTH_401K,
  AccountType.PRETAX_403b,
  AccountType.ROTH_403b,
  AccountType.PRETAX_403b9,
  AccountType.ROTH_403b9,
];

export const ROTH_ACCOUNTS = [
  AccountType.ROTH_IRA,
  AccountType.ROTH_401K,
  AccountType.ROTH_401K,
  AccountType.ROTH_403b,
  AccountType.ROTH_403b9,
  AccountType.HSA,
];

export const REGULAR_ACCOUNTS = [
  AccountType.BROKERAGE,
  AccountType.CHECKING,
  AccountType.SAVINGS,
];

export const PRETAX_ACCOUNTS = [
  AccountType.PRETAX_401K,
  AccountType.TRADITIONAL_IRA,
  AccountType.ROLLOVER_IRA,
  AccountType.SEP_IRA,
  AccountType.SIMPLE_IRA,
  AccountType.PRETAX_403b,
  AccountType.PRETAX_403b9,
];

export enum BucketType {
  REGULAR = "REGULAR",
  PRETAX = "PRETAX",
  ROTH = "ROTH"
}

export interface Buckets {
  pretax: number;
  roth: number;
  regular: number;
}

export interface AmortizedBuckets {
  year: number;
  buckets: Buckets;
}


// [{year: 1, buckets:{pretax: amount, roth: amount, regular: amount}}]
// [{year: 2, buckets:{pretax: amount, roth: amount, regular: amount}}]


export class RetirementCore {

  constructor() { }

  public test() {
    return 42;
  }

  public getBucketsForAccountType(type: AccountType): BucketType[] {
    const buckets: BucketType[] = [];

    switch (type) {
      case AccountType.PRETAX_401K:
      case AccountType.TRADITIONAL_IRA:
      case AccountType.SEP_IRA:
      case AccountType.SIMPLE_IRA:
      case AccountType.PRETAX_403b:
      case AccountType.PRETAX_403b9:
        buckets.push(BucketType.PRETAX);
        break;
      case AccountType.ROTH_401K:
      case AccountType.ROTH_IRA:
      case AccountType.ROTH_403b:
      case AccountType.ROTH_403b9:
      case AccountType.HSA:
        buckets.push(BucketType.PRETAX);
        buckets.push(BucketType.ROTH);
        break;
      case AccountType.BROKERAGE:
      case AccountType.CHECKING:
      case AccountType.SAVINGS:
        buckets.push(BucketType.REGULAR);
        break;

    }

    return buckets;
  }


  /**
   * Creates an Amortization schedule style report for an Account.
   *
   * Should provide 3 buckets of money: pre-tax, roth, regular
   *
   * for example:
   *
   * If the account in question is an IRA, we money will only accumulate in
   * the pre-tax bucket.
   *
   * But if the account is a Roth 401K, then the account holders contributions
   * will accumulate in the roth bucket, but any employer match will accumulate
   * in the pre-tax bucket.
   *
   * A brokerage or savings account will accumulate in the regular bucket.
   *
   * @param accountType The type of account. Traditional/Pre-tax 401K, Roth IRA, etc.
   * @param age Age of account holder
   * @param salary Salary of account holder
   * @param years How many years to amortize
   * @param startingBalance Current invested balance in the account
   * @param interest The interest rate as a decimal; for 9% it would be 0.09
   * @param dividend The dividend yeild as a decimal; for 1% it would be 0.01
   * @param dividendReinvested Whether or not dividends are reinvest automatically
   * @param contribution The amount the account holder will contribute monthly
   * @param matchLimit The percentage match limit
   * @param matchOfPay The percent of the account holder's salary is matched to the matchLimit
   * @param employerContribute The amount the employer is contributing towards the account holders account
   * @param catchup The ammount add to the account holder contribution starting at catchupAge
   * @param catchupAge The age when the account holder is allow to add the catchup amount to the contributions
   */
  public amortizeAccount(
    accountType: AccountType,
    age: number,
    salary: number,
    years: number,
    startingBalance: Buckets,
    interest: number,
    dividend: number,
    dividendReinvested: boolean,
    contribution: number,
    matchLimit: number,
    matchOfPay: number,
    employerContribute: number,
    catchup: number,
    catchupAge: number) {


    const schedule: AmortizedBuckets[] = [];

    schedule.push({
      year: 0,
      buckets: startingBalance
    });


    // TODO we should be able to include this for 401ks too, I think those
    // funds actually do have a dividend yield
    if (OPTIONAL_REINVEST_DIVIDEND_ACCOUNTS.includes(accountType)) {
      if (dividendReinvested) {
        interest += dividend;
      }
    }


    let currentPretax = startingBalance.pretax;
    let currentRoth = startingBalance.roth;
    let currentRegular = startingBalance.regular;

    for (let i = 1; i <= years; i++) {
      // iteratively build each successive year.
      // starting * (1 + rate/12)^(12*years)
      // cb.pt * (1 + .1/12) ^ 1
      // do for each bucket:

      // pretax:
      let pretaxNextAcc = currentPretax;
      // We might have to accumulate for the pretax account if the main
      // account type is ROTH (since employer matches are pretax or the
      // account holder my have rolled funds in or switched from pretax
      // to roth at some point)
      if (PRETAX_ACCOUNTS.includes(accountType) || currentPretax > 0) {
        let pretax = currentPretax;
        let pretaxNext = pretax * (1 + (interest));

        // Only add the contribution if the main account type is pretax
        if (PRETAX_ACCOUNTS.includes(accountType)) {
          pretaxNextAcc = pretaxNext + contribution;
        } else {
          pretaxNextAcc = pretaxNext;
        }
      }

      let regularNextAcc = currentRegular;
      if (REGULAR_ACCOUNTS.includes(accountType)) {
        regularNextAcc = currentRegular * (1 + (interest));
        regularNextAcc += contribution;
      }

      let rothNextAcc = currentRoth;
      if (ROTH_ACCOUNTS.includes(accountType)) {
        rothNextAcc = currentRoth * (1 + (interest));
        rothNextAcc += contribution;
      }




      // catch up
      if (CATCHUP_ALLOWED_ACCOUNTS.includes(accountType) && age >= catchupAge) {
        if (PRETAX_ACCOUNTS.includes(accountType)) {
          pretaxNextAcc += catchup;
        } else if (ROTH_ACCOUNTS.includes(accountType)) {
          rothNextAcc += catchup;
        }
      }

      // employer match
      if (EMPLOYER_MATCH_ACCOUNTS.includes(accountType) && matchLimit > 0 && matchOfPay > 0) {

        // Should the account holder get the match Limit or a smaller limit if he/she didn't contribute enough.
        const minLimit = Math.min(contribution / salary, matchLimit);

        // employer match is always pretax
        pretaxNextAcc += (salary * minLimit) * matchOfPay;
      }

      // employer contribute
      if (EMPLOYER_CONTRIBUTE_ACCOUNTS.includes(accountType) && employerContribute > 0) {
        // employer contribution is always pretax
        pretaxNextAcc += employerContribute;
      }

      // Round to two digits
      pretaxNextAcc = Math.round(pretaxNextAcc * 100) / 100;
      regularNextAcc = Math.round(regularNextAcc * 100) / 100;
      rothNextAcc = Math.round(rothNextAcc * 100) / 100;

      const next: AmortizedBuckets = {
        year: i,
        buckets: {
          pretax: pretaxNextAcc,
          roth: rothNextAcc,
          regular: regularNextAcc
        }
      };

      schedule.push(next);

      currentPretax = pretaxNextAcc;
      currentRegular = regularNextAcc;
      currentRoth = rothNextAcc;

    }

    return schedule;
  }
}