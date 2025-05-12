import Joi from 'joi';

export const createPlaylistSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'name is required',
  }),
  description: Joi.string().required().messages({
    'string.empty': 'description is required',
  }),
});

export const updatePlaylistSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
}).or('name', 'description').messages({
  'object.missing': 'name or description must be provided',
});
