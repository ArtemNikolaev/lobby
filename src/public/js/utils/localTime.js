const toFixedTimeUnitWidth = (value) => {
  return value.toString().padStart(2, "0");
}

const createLocalTimeString = (utcSecondsSinceEpoch) => {
  const date = new Date(0);
  date.setUTCSeconds(utcSecondsSinceEpoch);
  const hours = toFixedTimeUnitWidth(date.getHours());
  const minutes = toFixedTimeUnitWidth(date.getMinutes());
  const seconds = toFixedTimeUnitWidth(date.getSeconds());

  return `${hours}:${minutes}:${seconds}`;
}

export default createLocalTimeString;