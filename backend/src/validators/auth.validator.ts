import { body } from 'express-validator';
import { validationResultHandler } from '../utils/validation.util';

export const validateRegister = [
  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Formato de correo inválido')
    .normalizeEmail(),

  body('contrasena')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),

  validationResultHandler,
];

export const validateLogin = [
  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es requerido')
    .isEmail()
    .withMessage('Formato de correo inválido'),

  body('contrasena')
    .notEmpty()
    .withMessage('La contraseña es requerida'),

  validationResultHandler,
];
