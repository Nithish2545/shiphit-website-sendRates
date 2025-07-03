function getUpdatedTrackingStructure(trackingData, statusTrail) {
  const STATUS_OUT_FOR = "Out For Delivery Today";
  const STATUS_DELIVERED = "DELIVERED";
  const STATUS_DELAY_1 =
    "We are experiencing transit delays. We will deliver your package as soon as possible.";
  const STATUS_DELAY_2 =
    "We are experiencing transit delays. We will deliver your package as soon as possible. / Your package";

  const fixedStructure = [
    { Status: "Custom clearance" },
    { Status: "On the way" },
    { Status: STATUS_OUT_FOR },
    { Status: STATUS_DELIVERED },
  ];

  function parseDateTime(date, time) {
    return new Date(
      `${date.split("/").reverse().join("-")}T${time.replace(
        /(..)(..)/,
        "$1:$2"
      )}`
    );
  }

  function processTrackingData(data) {
    const finalStatuses = [];
    const delayStatus = [];
    const onTheWay = [];

    for (const { Status, EventDate1, EventDate, EventTime, Location } of data) {
      const entry = {
        Status,
        EventDate1,
        Location,
        timestamp: parseDateTime(EventDate, EventTime),
      };

      if (Status === STATUS_OUT_FOR || Status === STATUS_DELIVERED) {
        finalStatuses.push(entry);
      } else if (Status === STATUS_DELAY_1 || Status === STATUS_DELAY_2) {
        delayStatus.push({
          ...entry,
          Status: "Custom clearance",
        });
      } else {
        onTheWay.push({ ...entry, Status: "On the way" });
      }
    }

    const latestOnTheWay =
      onTheWay.length > 0 ? onTheWay[onTheWay.length - 1] : null;

    const merged = [
      ...(latestOnTheWay ? [latestOnTheWay] : []),
      ...delayStatus,
      ...finalStatuses,
    ];

    const uniqueStatusMap = new Map();
    for (const item of merged) {
      if (!uniqueStatusMap.has(item.Status)) {
        uniqueStatusMap.set(item.Status, item);
      }
    }

    return Array.from(uniqueStatusMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
  }

  const result = processTrackingData(trackingData);
  const resultMap = new Map(result.map((item) => [item.Status, item]));

  const updatedStructure = fixedStructure.map((item) => {
    const match = resultMap.get(item.Status);
    return match
      ? {
          ...item,
          Progress: true,
          DateTime: match.EventDate1,
          Location: match.Location,
        }
      : {
          ...item,
          Progress: false,
          DateTime: "",
          Location: "",
        };
  });

  return {
    vendorData: updatedStructure,
    internalData: statusTrail,
  };
}

export default getUpdatedTrackingStructure;
