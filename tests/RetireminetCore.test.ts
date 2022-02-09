import { RetirementCore, BucketType, AccountType } from '../src/core/RetirementCore';



test('test() returns 42', () => {
  const rc = new RetirementCore();
  expect(rc.test()).toBe(42);
});


test('getBucketsForAccountType() returns the correct buckets', () => {

  const rc = new RetirementCore();

  expect(rc.getBucketsForAccountType).not.toBeUndefined();

  expect(rc.getBucketsForAccountType(AccountType.PRETAX_401K)).toEqual(expect.arrayContaining([BucketType.PRETAX]));
  expect(rc.getBucketsForAccountType(AccountType.TRADITIONAL_IRA)).toEqual(expect.arrayContaining([BucketType.PRETAX]));
  expect(rc.getBucketsForAccountType(AccountType.SEP_IRA)).toEqual(expect.arrayContaining([BucketType.PRETAX]));
  expect(rc.getBucketsForAccountType(AccountType.SIMPLE_IRA)).toEqual(expect.arrayContaining([BucketType.PRETAX]));
  expect(rc.getBucketsForAccountType(AccountType.PRETAX_403b)).toEqual(expect.arrayContaining([BucketType.PRETAX]));
  expect(rc.getBucketsForAccountType(AccountType.PRETAX_403b9)).toEqual(expect.arrayContaining([BucketType.PRETAX]));


  expect(rc.getBucketsForAccountType(AccountType.ROTH_401K)).toEqual(expect.arrayContaining([BucketType.PRETAX, BucketType.ROTH]));
  expect(rc.getBucketsForAccountType(AccountType.ROTH_IRA)).toEqual(expect.arrayContaining([BucketType.PRETAX, BucketType.ROTH]));
  expect(rc.getBucketsForAccountType(AccountType.ROTH_403b)).toEqual(expect.arrayContaining([BucketType.PRETAX, BucketType.ROTH]));
  expect(rc.getBucketsForAccountType(AccountType.ROTH_403b9)).toEqual(expect.arrayContaining([BucketType.PRETAX, BucketType.ROTH]));
  expect(rc.getBucketsForAccountType(AccountType.HSA)).toEqual(expect.arrayContaining([BucketType.PRETAX, BucketType.ROTH]));


  expect(rc.getBucketsForAccountType(AccountType.BROKERAGE)).toEqual(expect.arrayContaining([BucketType.REGULAR]));
  expect(rc.getBucketsForAccountType(AccountType.CHECKING)).toEqual(expect.arrayContaining([BucketType.REGULAR]));
  expect(rc.getBucketsForAccountType(AccountType.SAVINGS)).toEqual(expect.arrayContaining([BucketType.REGULAR]));


});

test('amortizeAccount() PRETAX_401K - return correct data for year 0', () => {
  const rc = new RetirementCore();

  expect(rc.amortizeAccount).not.toBeUndefined();

  let startingBalance = { pretax: 10000, roth: 0, regular: 0 };

  let interestRate = 0.1;
  let dividendYield = 0.01;
  let age = 30;
  let salary = 100000;
  let years = 0;
  let yearlyContribution = 1000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let catchupAge = 55;
  let employerContribute = 0;
  let reinvestDividend = true;
  let result = rc.amortizeAccount(
    AccountType.PRETAX_401K,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result).toEqual([{ year: years, buckets: startingBalance }]);

});

test('amortizeAccount() PRETAX_401K - will compound contributions in a pretax 401K', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 10000, roth: 0, regular: 0 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 20;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.PRETAX_401K,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 12200.00, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 14620.00, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 17282.00, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 20210.20, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 23431.22, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 26974.34, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 30871.77, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 35158.95, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 39874.85, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 45062.34, roth: 0, regular: 0 } });
});

test('amortizeAccount() PRETAX_401K - add catch-up contributions in pretax of 401K', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 100000, roth: 0, regular: 0 };
  let interestRate = 0.09;
  let dividendYield = 0.01;
  let age = 55;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 12000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 3000;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.PRETAX_401K,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 124000, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 150160, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 178674.40, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 209755.10, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 243633.06, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 280560.04, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 320810.44, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 364683.38, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 412504.88, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 464630.32, roth: 0, regular: 0 } });

});

test('amortizeAccount() PRETAX_401K - add employeer match FULL in pretax of 401K', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 100000, roth: 0, regular: 0 };
  let interestRate = 0.08;
  let dividendYield = 0.01;
  let age = 25;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 5000;
  let matchLimit = 0.10;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.PRETAX_401K,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 118000, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 137440, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 158435.2, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 181110.02, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 205598.82, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 232046.73, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 260610.47, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 291459.31, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 324776.05, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 360758.13, roth: 0, regular: 0 } });

});

test('amortizeAccount() PRETAX_401K - add employeer contribution in pretax of 401K', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 100000, roth: 0, regular: 0 };
  let interestRate = 0.08;
  let dividendYield = 0.01;
  let age = 25;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 5000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 25000;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.PRETAX_401K,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 138000, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 179040, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 223363.2, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 271232.26, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 322930.84, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 378765.31, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 439066.53, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 504191.85, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 574527.2, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 650489.38, roth: 0, regular: 0 } });

});

test('amortizeAccount() PRETAX_401K - add employeer match HALF in pretax of 401K', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 100000, roth: 0, regular: 0 };
  let interestRate = 0.08;
  let dividendYield = 0.01;
  let age = 25;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 5000;
  let matchLimit = 0.10;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.PRETAX_401K,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 118000, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 137440, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 158435.2, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 181110.02, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 205598.82, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 232046.73, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 260610.47, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 291459.31, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 324776.05, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 360758.13, roth: 0, regular: 0 } });

});

/////////////

test('amortizeAccount() TRADITIONAL_IRA - return correct data for year 0', () => {
  const rc = new RetirementCore();

  expect(rc.amortizeAccount).not.toBeUndefined();

  let startingBalance = { pretax: 10000, roth: 0, regular: 0 };

  let interestRate = 0.1;
  let dividendYield = 0.01;
  let age = 30;
  let salary = 100000;
  let years = 0;
  let yearlyContribution = 1000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let catchupAge = 55;
  let employerContribute = 0;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.TRADITIONAL_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result).toEqual([{ year: years, buckets: startingBalance }]);

});

test('amortizeAccount() TRADITIONAL_IRA - will compound contributions with dividend reinvested in a Traditional IRA', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 10000, roth: 0, regular: 0 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 20;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.TRADITIONAL_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 12300.00, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 14853.00, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 17686.83, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 20832.38, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 24323.94, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 28199.57, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 32501.52, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 37276.69, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 42577.13, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 48460.61, roth: 0, regular: 0 } });
});

test('amortizeAccount() TRADITIONAL_IRA - will compound contributions with NO dividend reinvested in a Traditional IRA', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 10000, roth: 0, regular: 0 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 20;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = false;

  let result = rc.amortizeAccount(
    AccountType.TRADITIONAL_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 12200.00, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 14620.00, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 17282.00, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 20210.20, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 23431.22, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 26974.34, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 30871.77, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 35158.95, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 39874.85, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 45062.34, roth: 0, regular: 0 } });
});

test('amortizeAccount() TRADITIONAL_IRA - add catch-up contributions with dividend reinvested in a Traditional IRA', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 100000, roth: 0, regular: 0 };
  let interestRate = 0.09;
  let dividendYield = 0.01;
  let age = 55;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 12000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 3000;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.TRADITIONAL_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 125000, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 152500, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 182750, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 216025, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 252627.5, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 292890.25, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 337179.28, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 385897.21, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 439486.93, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 498435.62, roth: 0, regular: 0 } });

});

test('amortizeAccount() TRADITIONAL_IRA - add catch-up contributions with NO dividend reinvested in a Traditional IRA', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 100000, roth: 0, regular: 0 };
  let interestRate = 0.09;
  let dividendYield = 0.01;
  let age = 55;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 12000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 3000;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = false;

  let result = rc.amortizeAccount(
    AccountType.TRADITIONAL_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 124000, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 150160, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 178674.40, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 209755.10, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 243633.06, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 280560.04, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 320810.44, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 364683.38, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 412504.88, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 464630.32, roth: 0, regular: 0 } });

});

/////////////

test('amortizeAccount() ROLLOVER_IRA - return correct data for year 0', () => {
  const rc = new RetirementCore();

  expect(rc.amortizeAccount).not.toBeUndefined();

  let startingBalance = { pretax: 10000, roth: 0, regular: 0 };

  let interestRate = 0.1;
  let dividendYield = 0.01;
  let age = 30;
  let salary = 100000;
  let years = 0;
  let yearlyContribution = 1000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let catchupAge = 55;
  let employerContribute = 0;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.ROLLOVER_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result).toEqual([{ year: years, buckets: startingBalance }]);

});

test('amortizeAccount() ROLLOVER_IRA - will compound contributions with dividend reinvested in a Traditional IRA', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 10000, roth: 0, regular: 0 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 20;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.ROLLOVER_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 12300.00, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 14853.00, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 17686.83, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 20832.38, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 24323.94, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 28199.57, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 32501.52, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 37276.69, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 42577.13, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 48460.61, roth: 0, regular: 0 } });
});

test('amortizeAccount() ROLLOVER_IRA - will compound contributions with NO dividend reinvested in a Traditional IRA', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 10000, roth: 0, regular: 0 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 20;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = false;

  let result = rc.amortizeAccount(
    AccountType.ROLLOVER_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 12200.00, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 14620.00, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 17282.00, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 20210.20, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 23431.22, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 26974.34, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 30871.77, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 35158.95, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 39874.85, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 45062.34, roth: 0, regular: 0 } });
});

test('amortizeAccount() ROLLOVER_IRA - add catch-up contributions with dividend reinvested in a Traditional IRA', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 100000, roth: 0, regular: 0 };
  let interestRate = 0.09;
  let dividendYield = 0.01;
  let age = 55;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 12000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 3000;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.ROLLOVER_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 125000, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 152500, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 182750, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 216025, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 252627.5, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 292890.25, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 337179.28, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 385897.21, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 439486.93, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 498435.62, roth: 0, regular: 0 } });

});

test('amortizeAccount() ROLLOVER_IRA - add catch-up contributions with NO dividend reinvested in a Traditional IRA', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 100000, roth: 0, regular: 0 };
  let interestRate = 0.09;
  let dividendYield = 0.01;
  let age = 55;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 12000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 3000;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = false;

  let result = rc.amortizeAccount(
    AccountType.ROLLOVER_IRA,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 124000, roth: 0, regular: 0 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 150160, roth: 0, regular: 0 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 178674.40, roth: 0, regular: 0 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 209755.10, roth: 0, regular: 0 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 243633.06, roth: 0, regular: 0 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 280560.04, roth: 0, regular: 0 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 320810.44, roth: 0, regular: 0 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 364683.38, roth: 0, regular: 0 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 412504.88, roth: 0, regular: 0 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 464630.32, roth: 0, regular: 0 } });

});


/////////////

test('amortizeAccount() BROKERAGE - return correct data for year 0', () => {
  const rc = new RetirementCore();

  expect(rc.amortizeAccount).not.toBeUndefined();

  let startingBalance = { pretax: 0, roth: 0, regular: 4000 };

  let interestRate = 0.1;
  let dividendYield = 0.01;
  let age = 30;
  let salary = 100000;
  let years = 0;
  let yearlyContribution = 1000;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let catchupAge = 55;
  let employerContribute = 0;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.BROKERAGE,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result).toEqual([{ year: years, buckets: startingBalance }]);

});

test('amortizeAccount() BROKERAGE - will compound contributions with dividend reinvested in a brokerage account', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 0, roth: 0, regular: 10000 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 20;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.BROKERAGE,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 0, roth: 0, regular: 12300.00 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 0, roth: 0, regular: 14853.00 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 0, roth: 0, regular: 17686.83 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 0, roth: 0, regular: 20832.38 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 0, roth: 0, regular: 24323.94 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 0, roth: 0, regular: 28199.57 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 0, roth: 0, regular: 32501.52 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 0, roth: 0, regular: 37276.69 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 0, roth: 0, regular: 42577.13 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 0, roth: 0, regular: 48460.61 } });
});

test('amortizeAccount() BROKERAGE - will compound contributions with NO dividend reinvested in a brokerage account', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 0, roth: 0, regular: 10000 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 20;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 0;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = false;

  let result = rc.amortizeAccount(
    AccountType.BROKERAGE,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 0, roth: 0, regular: 12200.00 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 0, roth: 0, regular: 14620.00 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 0, roth: 0, regular: 17282.00 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 0, roth: 0, regular: 20210.20 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 0, roth: 0, regular: 23431.22 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 0, roth: 0, regular: 26974.34 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 0, roth: 0, regular: 30871.77 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 0, roth: 0, regular: 35158.95 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 0, roth: 0, regular: 39874.85 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 0, roth: 0, regular: 45062.34 } });
});

test('amortizeAccount() BROKERAGE - add catch-up contributions with dividend reinvested in a brokerage account', () => {
  /*
  catch-up contributions are not part of BROKERAGE accounts the catch-up amount used shouldn't have any effect. We should
  see just normal compounding.
  */

  const rc = new RetirementCore();
  let startingBalance = { pretax: 0, roth: 0, regular: 10000 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 55;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 3000;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = true;

  let result = rc.amortizeAccount(
    AccountType.BROKERAGE,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );


  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 0, roth: 0, regular: 12300.00 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 0, roth: 0, regular: 14853.00 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 0, roth: 0, regular: 17686.83 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 0, roth: 0, regular: 20832.38 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 0, roth: 0, regular: 24323.94 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 0, roth: 0, regular: 28199.57 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 0, roth: 0, regular: 32501.52 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 0, roth: 0, regular: 37276.69 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 0, roth: 0, regular: 42577.13 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 0, roth: 0, regular: 48460.61 } });

});

test('amortizeAccount() BROKERAGE - add catch-up contributions with NO dividend reinvested in a brokerage account', () => {
  const rc = new RetirementCore();
  let startingBalance = { pretax: 0, roth: 0, regular: 10000 };
  let interestRate = 0.10;
  let dividendYield = 0.01;
  let age = 55;
  let salary = 100000;
  let years = 10;
  let yearlyContribution = 1200;
  let matchLimit = 0.00;
  let matchOfPay = 1.00;
  let yearlyCatchUp = 3000;
  let employerContribute = 0;
  let catchupAge = 55;
  let reinvestDividend = false;

  let result = rc.amortizeAccount(
    AccountType.BROKERAGE,
    age,
    salary,
    years,
    startingBalance,
    interestRate,
    dividendYield,
    reinvestDividend,
    yearlyContribution,
    matchLimit,
    matchOfPay,
    employerContribute,
    yearlyCatchUp,
    catchupAge
  );

  expect(result[0]).toEqual({ year: 0, buckets: startingBalance });
  expect(result[1]).toEqual({ year: 1, buckets: { pretax: 0, roth: 0, regular: 12200.00 } });
  expect(result[2]).toEqual({ year: 2, buckets: { pretax: 0, roth: 0, regular: 14620.00 } });
  expect(result[3]).toEqual({ year: 3, buckets: { pretax: 0, roth: 0, regular: 17282.00 } });
  expect(result[4]).toEqual({ year: 4, buckets: { pretax: 0, roth: 0, regular: 20210.20 } });
  expect(result[5]).toEqual({ year: 5, buckets: { pretax: 0, roth: 0, regular: 23431.22 } });
  expect(result[6]).toEqual({ year: 6, buckets: { pretax: 0, roth: 0, regular: 26974.34 } });
  expect(result[7]).toEqual({ year: 7, buckets: { pretax: 0, roth: 0, regular: 30871.77 } });
  expect(result[8]).toEqual({ year: 8, buckets: { pretax: 0, roth: 0, regular: 35158.95 } });
  expect(result[9]).toEqual({ year: 9, buckets: { pretax: 0, roth: 0, regular: 39874.85 } });
  expect(result[10]).toEqual({ year: 10, buckets: { pretax: 0, roth: 0, regular: 45062.34 } });

});

