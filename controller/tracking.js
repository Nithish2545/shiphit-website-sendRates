import vendorCredentials from "../Utilis/credentials.js";
import getVendorTrackingDetails from "../vendordata/vendor-api-data.js";
import getTrackingStatus from "../Utilis/dataformat.js";
import { readFile } from "fs/promises";
import admin from "firebase-admin";
import getUpdatedTrackingStructure from "../Utilis/formatedTrackingDetails.js";

// Load service account JSON using fs/promises
const serviceAccount = JSON.parse(
  await readFile(new URL("./serviceAccountKey.json", import.meta.url))
);

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const getTrackingDetails = async (req, res) => {
  const { awbNumber, vendorawbnumber } = req.body;

  const requestBody = { ...vendorCredentials.UPS, AWBNo: vendorawbnumber };

  if (!awbNumber) {
    return res.status(400).json({ error: "awbNumber is required" });
  }

  try {
    const snapshot = await db
      .collection("pickup")
      .where("awbNumber", "==", awbNumber)
      .get();

    if (snapshot.empty) {
      return res
        .status(404)
        .json({ error: "No document found with that awbNumber" });
    }

    const docData = snapshot.docs[0].data();
    const statusTrail = getTrackingStatus(docData.status, docData);

    if (docData.status !== "SHIPMENT CONNECTED") {
      return res.status(200).json({
        awbNumber,
        currentStatus: docData.status,
        statusTrail,
        vendorData: [
          {
            Status: "DELIVERD",
            Location: "",
            Progress: false,
            DateTime: "",
          },
          {
            Status: "On the way",
            Location: "",
            Progress: false,
            DateTime: "",
          },
          {
            Status: "Custom Clearence",
            Location: "",
            Progress: false,
            DateTime: "",
          },
        ],
      });
    }

    // If SHIPMENT CONNECTED, get vendor details and return
    const vendorResponse = await getVendorTrackingDetails(requestBody);
    const updatedStructure = getUpdatedTrackingStructure(
      vendorResponse,
      statusTrail
    );
    return res.send(updatedStructure); // <-- return added here
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export default getTrackingDetails;
