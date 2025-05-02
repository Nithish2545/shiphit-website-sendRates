import axios from "axios";

async function getVendorTrackingDetails(
  currentStatus,
  requestBody,
  statusTrail
) {
  try {
    const response = await axios.post(
      "http://worldfirst.xpresion.in/api/v1/Tracking/Tracking",
      requestBody
    );
    return [...statusTrail, ...response.data.Response.Events.reverse()];
  } catch (error) {
    return { message: "Error with the API request", error: error.message };
  }
}

export default getVendorTrackingDetails;
