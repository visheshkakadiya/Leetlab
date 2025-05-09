
export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const fieldErrors = {};
    error.details.forEach((err) => {
      const field = err.context.key;
      fieldErrors[field] = err.message;
    });

    return res.status(400).json({
      success: false,
      message: "Validation Failed",
      errors: fieldErrors
    });
  }

  next();
};
