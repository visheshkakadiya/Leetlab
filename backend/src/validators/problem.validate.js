import Joi from 'joi';

export const createProblemSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters',
  }),
  description: Joi.string().min(10).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 10 characters',
  }),
  difficulty: Joi.string().valid('EASY', 'MEDIUM', 'HARD').required().messages({
    'any.only': 'Difficulty must be one of EASY, MEDIUM, or HARD',
    'string.empty': 'Difficulty is required',
  }),
  tags: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Tags must be an array of strings',
  }),
  examples: Joi.object().required("examples is required"),
  constraints: Joi.string().required().messages({
    'string.empty': 'Constraints are required',
  }),
  company: Joi.array().items(Joi.string()).required().messages({
    'array.base': 'Companies must be an array of strings',
  }),
  hints: Joi.string().allow(null, ''),
  editorial: Joi.string().allow(null, ''),
  testcases: Joi.array().required("testcases is required"),
  codeSnippets: Joi.object().required(),
  referenceSolutions: Joi.object(),
});

export const updateProblemSchema = createProblemSchema.fork(
  Object.keys(createProblemSchema.describe().keys),
  (schema) => schema.optional()
);

// export const executeCodeSchema = Joi.object({
//   source_code: Joi.string().required().messages({
//     'string.empty': 'source_code is required',
//   }),
//   language_id: Joi.number().required().messages({
//     'any.required': 'language_id is required',
//   }),
//   stdin: Joi.array().required().messages({
//     'array.base': 'stdin is required',
//   }),
//   expected_outputs: Joi.array().required().messages({
//     'array.base': 'expected_outputs is required',
//   }),
//   problemId: Joi.string().required().messages({
//     'string.empty': 'Problem Id is required',
//   }),
// });
