import Joi from 'joi';

export const createPlaylistSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'name is required',
  }),
  description: Joi.string().max(150).optional(),
});

export const updatePlaylistSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional(),
}).or('name', 'description').messages({
  'object.missing': 'name or description must be provided',
});
