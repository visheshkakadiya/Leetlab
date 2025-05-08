import Joi from 'joi';

export const registerSchema = Joi.object({
    name: Joi.string().min(2).max(30).required().messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'string.empty': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
    }),
});

export const updateProfileSchema = Joi.object({
    name: Joi.string().min(2).max(30).optional(),
    email: Joi.string().email().optional(),
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Enter a valid email',
        'string.empty': 'Email is required',
    }),
});

export const resetPasswordSchema = Joi.object({
    newPassword: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters',
    }),
});
