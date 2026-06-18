import Message from "../models/Message.js";

const sendMessage = async (
  req,
  res
) => {
  try {
    const message =
      await Message.create(req.body);

    res.status(201).json({
      message:
        "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { sendMessage };