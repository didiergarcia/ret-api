import { NextFunction, Request, Response } from "express";
import { RetirementCore } from "../core/RetirementCore";



export class RetirementController {


 async test(req: Request, res: Response, next: NextFunction) {

  const rc = new RetirementCore();



  return rc.test();
 }


}