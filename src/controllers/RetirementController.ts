import { NextFunction, Request, Response } from "express";
import { RetirementCore } from "../core/RetirementCore";



export class RetirementController {


  async test(req: Request, res: Response, next: NextFunction) {

    const rc = new RetirementCore();

    return rc.test();
  }


  async amortizeAccount(req: Request, res: Response, next: NextFunction) {

    try {
      const rc = new RetirementCore();
      const accountType = req.body.accountType;
      const startingBalance = { pretax: req.body.balance.pretax, roth: req.body.balance.roth, regular: req.body.balance.regular };
      const interestRate = req.body.interest;
      const dividendYield = req.body.dividend;
      const age = req.body.age;
      const salary = req.body.salary;
      const years = req.body.years;
      const yearlyContribution = req.body.contribution;
      const matchLimit = req.body.matchLimit;
      const matchOfPay = req.body.matchOfPay;
      const yearlyCatchUp = req.body.catchup;
      const catchupAge = req.body.catchupAge;
      const employerContribute = req.body.employerContribute;
      const reinvestDividend = req.body.reinvestDividend;

      const result = rc.amortizeAccount(
        accountType,
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

      return res.json(result);
    } catch (err) {
      return res.status(500).json({msg: "Error amortizing account.", error: err });
    }
  }
}