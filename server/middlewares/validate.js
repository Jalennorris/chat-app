import { check, validationResult } from "express-validator";

export const createUserValidationRules = [
    // Example validation rules for user creation
    check('first_name').not().isEmpty().withMessage('First name is required'),
    check('last_name').not().isEmpty().withMessage('Last name is required'),
    check('email').isEmail().withMessage('Invalid email').normalizeEmail(),
    check('phone').isMobilePhone().withMessage('Invalid phone number'),
    check('user_name').not().isEmpty().withMessage('Username is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

export const loginValidationRules = [
    check('user_name').not().isEmpty().withMessage('Username is required'),
    check('password').not().isEmpty().withMessage('Password is required'), // Fixed missing withMessage
];

export const Validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = {};
        errors.array().map((err) => (error[err.param] = err.msg));
        return res.status(422).json({ error });
    }
    next();
};
