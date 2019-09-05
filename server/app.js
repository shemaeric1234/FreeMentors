import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../swagger';
import usersRouter from './routes/users';
import sessionRouter from './routes/sessions';
import sessionReviewRouter from './routes/sessionReview';

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/API/v1', usersRouter);
app.use('/API/v1', sessionRouter);
app.use('/API/v1', sessionReviewRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// ERRROR HANDLING

app.use((req, _res, next) => {
  const error = new Error('That Kind of Request does Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status);
  res.json({
    status: '404',
    error: error.message,
  });
});

export default app;
