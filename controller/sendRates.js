import axios from "axios";

const sendRates = async (req, res) => {
  const { phoneNumber, amount, country } = req.body;

  if (!phoneNumber || !amount || !country) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const options = {
    method: "POST",
    url: "https://public.doubletick.io/whatsapp/message/template",
    headers: {
      Authorization: "key_z6hIuLo8GC",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: {
      messages: [
        {
          content: {
            language: "en",
            templateData: {
              body: {
                placeholders: [country, `₹${amount}`],
              },
            },
            templateName: "lowratestestfinals5",
          },
          from: "+919600690881",
          to: phoneNumber,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("WhatsApp API Error:", error);

    return res.status(500).json({ error: "Invalid Phone Number!" });
  }
};

export default sendRates;
