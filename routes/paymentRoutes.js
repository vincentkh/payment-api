const router = require('express').Router();
const Payment = require('../models/payment');

const { authenticate } = require('../middleware/authenticate');
const { ApiError } = require('../utils/errors');
const { handleError } = require('../utils/utils');
const { Status } = require('../utils/constants');

/**
 * Fetch list of payments
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const payments = await Payment.find();
    res.json(payments);

  } catch (error) {
    handleError(res, error, {
      code: 'FETCH_PAYMENTS_ERROR',
      message: 'Error fetching payments, please try again later.',
    });
  }
});

/**
 * Fetch payment by ID
 */
router.get('/:_id', authenticate, async (req, res) => {
  try {
    const { _id } = req.params;
    const payment = await Payment.findOne({ _id });

    res.status(200)
      .json(payment);

  } catch (error) {
    handleError(res, error, {
      code: 'FETCH_PAYMENT_ERROR',
      message: `Error fetching payment, please try again later`,
    });
  }
});

/**
 * Create new payment
 */
router.post('/', authenticate, async (req, res) => {
  try {
    const { payeeId, payerId, paymentSystem, paymentMethod, amount, currency, comment } = req.body;
    const payment = new Payment({
      payeeId, payerId, paymentSystem, paymentMethod, amount, currency, comment,
      status: Status.Created,
      created: new Date(),
      updated: new Date(),
    });

    const persistedPayment = await payment.save();
    res.status(201)
      .json(persistedPayment);

  } catch (error) {
    handleError(res, error, {
      code: 'CREATE_PAYMENT_ERROR',
      message: 'Error creating payment, please try again later.',
    });
  }
});

/**
 * Approve payment
 */
router.put('/:_id/approve', authenticate, async (req, res) => {
  try {
    const { _id } = req.params;

    const payment = await Payment.findById({ _id });
    if (payment) {
      if (payment.status === Status.Approved) {
        throw new ApiError('ERR_CANNOT_APPROVE', 'Payment already approved');
      }

      if (payment.status === Status.Cancelled) {
        throw new ApiError('ERR_CANNOT_APPROVE', 'Cannot approve a payment that has already been cancelled');
      }

      const result = await payment.update({ $set: { status: Status.Approved, updated: new Date() } });
      if (result.ok) {
        res.status(200).json();
      }
    }

    throw new ApiError('PAYMENT_NOT_FOUND', 'Payment not found !', 404);

  } catch (error) {
    handleError(res, error, {
      code: 'PAYMENT_APPROVE_ERROR',
      message: 'Error approving payment, please try again later',
    });
  }
});

/**
 * Cancel payment
 */
router.put('/:_id/cancel', authenticate, async (req, res) => {
  try {
    const { _id } = req.params;

    const payment = await Payment.findById({ _id });
    if (payment) {
      if (payment.status === Status.Cancelled) {
        throw new ApiError('ERR_CANNOT_CANCEL', 'Payment already cancelled');
      }

      if (payment.status === Status.Approved) {
        throw new ApiError('ERR_CANNOT_CANCEL', 'Cannot cancel a payment that has already been approved');
      }

      const result = await payment.update({ $set: { status: Status.Cancelled, updated: new Date() } });
      if (result.ok) {
        res.status(200).json();
      }
    }

    throw new ApiError('PAYMENT_NOT_FOUND', 'Payment not found !', 404);

  } catch (error) {
    handleError(res, error, {
      code: 'PAYMENT_CANCEL_ERROR',
      message: 'Error cancelling payment, please try again later',
    });
  }
});

module.exports = router;