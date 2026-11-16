const EmergencyContact = require("../models/EmergencyContact");

const getContacts = async (req, res) => {
  const contacts = await EmergencyContact.find({ user: req.user._id }).sort({ isPrimary: -1, createdAt: -1 });
  return res.json({ success: true, data: contacts });
};

const addContact = async (req, res) => {
  try {
    const { name, phone, relation, email, isPrimary } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }

    if (isPrimary) {
      await EmergencyContact.updateMany({ user: req.user._id }, { isPrimary: false });
    }

    const contact = await EmergencyContact.create({
      user: req.user._id,
      name,
      phone,
      relation,
      email,
      isPrimary: !!isPrimary,
    });

    return res.status(201).json({ success: true, data: contact });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to add contact", error: err.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findOne({ _id: req.params.id, user: req.user._id });
    if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });

    const { name, phone, relation, email, isPrimary } = req.body;
    if (name !== undefined) contact.name = name;
    if (phone !== undefined) contact.phone = phone;
    if (relation !== undefined) contact.relation = relation;
    if (email !== undefined) contact.email = email;

    if (isPrimary) {
      await EmergencyContact.updateMany({ user: req.user._id }, { isPrimary: false });
      contact.isPrimary = true;
    }

    await contact.save();
    return res.json({ success: true, data: contact });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Failed to update contact", error: err.message });
  }
};

const deleteContact = async (req, res) => {
  const contact = await EmergencyContact.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!contact) return res.status(404).json({ success: false, message: "Contact not found" });
  return res.json({ success: true, message: "Contact removed" });
};

module.exports = { getContacts, addContact, updateContact, deleteContact };
