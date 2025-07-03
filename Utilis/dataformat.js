import STATUS_FLOW from "./status.js";

const getTrackingStatus = (currentStatus, docData) => {
  const location = "Chennai";
  const upperStatus = currentStatus?.toUpperCase();
  const currentIndex = STATUS_FLOW.indexOf(upperStatus);

  if (currentIndex === -1) {
    return [{ Status: "Unknown Status", Location: location }];
  }

  let dataTimeDataset = [
    docData.pickupDatetime,
    docData.pickupCompletedDatatime,
    "-",
    "-",
    docData.PaymentComfirmedDate,
    docData.packageConnectedDataTime,
  ];
  return STATUS_FLOW.map((status, index) => ({
    Status: status,
    Location: location,
    Progress: index <= currentIndex,
    DateTime: dataTimeDataset[index],
  }));
};

export default getTrackingStatus;