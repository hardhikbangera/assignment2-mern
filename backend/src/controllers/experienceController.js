import Experience from '../models/Experience.js';
import Slot from '../models/Slot.js';

export const getAllExperiences = async (req, res) => {
  try {
    const { search } = req.query;
    const data = await Experience.getAll(search);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

export const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const experience = await Experience.getById(id);
    if (!experience) return res.status(404).json({ error: 'Not found' });
    const slots = await Slot.getByExperience(id);
    res.json({ experience, slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch details' });
  }
};