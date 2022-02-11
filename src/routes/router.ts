import { NextFunction, Request, Response } from "express";

var express = require('express');
var router = express.Router();
const apiRouter = express.Router();

const userRouter = require('./users');
const retirementRouter = require('./RetirementRouter');



// Add APIs
apiRouter.use('/rc', retirementRouter);
apiRouter.use('/users', userRouter);


router.use('/api/v1', apiRouter);


/* GET home page. */
router.get('/', function(req: Request, res: Response, next: NextFunction  ) {
  res.render('index', { title: 'Express' });
});


module.exports = router;
