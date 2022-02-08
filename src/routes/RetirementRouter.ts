import { NextFunction, Request, Response } from "express";
import { RetirementController } from "../controllers/RetirementController";

var express = require('express');
var router = express.Router();
const controller = new RetirementController();

/* Testing! */
router.get('/test', async function(req: Request, res: Response, next: NextFunction  ) {
  res.json(await controller.test(req,res,next));
});

module.exports = router;
