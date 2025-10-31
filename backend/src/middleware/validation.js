export const bookingValidator = (req, res, next) => {
  const { customer_name, customer_email } = req.body;
  if (!customer_name || !customer_email) return res.status(400).json({ error: 'Name and email required' });
  next();
};