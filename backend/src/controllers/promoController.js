import Promo from '../models/PromoCode.js';

export const validatePromoCode = async (req, res) => {
  try {
    const { code, amount } = req.body;
    if (!code) return res.status(400).json({ valid: false, error: 'Code required' });
    const promo = await Promo.findActive(code);
    if (!promo) return res.status(404).json({ valid: false, error: 'Invalid promo code' });
    let discount = 0;
    if (promo.discount_type === 'percentage') discount = (amount * parseFloat(promo.discount_value)) / 100;
    else discount = parseFloat(promo.discount_value);
    res.json({ valid: true, code: promo.code, discount_amount: Math.round(discount*100)/100 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ valid: false, error: 'Failed to validate' });
  }
};