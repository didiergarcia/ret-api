import { NextFunction, Request, Response } from "express";

var express = require('express');
var router = express.Router();

const userRouter = require('./users');
const retirementRouter = require('./RetirementRouter');

/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction  ) {
  res.render('index', { title: 'Express' });
});

router.use('/rc', retirementRouter);
router.use('/users', userRouter);

module.exports = router;
