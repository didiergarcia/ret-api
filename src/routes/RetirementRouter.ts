import { NextFunction, Request, Response } from "express";
import { RetirementController } from "../controllers/RetirementController";

var express = require('express');
var router = express.Router();
const controller = new RetirementController();

/* Testing! */
router.get('/test', (req: Request, res: Response, next: NextFunction) => {
  return controller.test(req, res, next);
});

router.post('/amortize', (req: Request, res: Response, next: NextFunction) => {
  return controller.amortizeAccount(req, res, next);
});


// router.get("/actions", (req: Request, res: Response, next: NextFunction) => {
//   (new ActionsApi().list(req, res, next)).catch((err) => {
//     console.log(err);
//     res
//       .status(500)
//       .json({ error: "Server Error. Check logs." })
//       .end();
//     return;
//   });
// });


module.exports = router;
