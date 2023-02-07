export default {

  /**
   * Performs validation for a leaflet marker data.
   * If the data is invalid displays an error.
   *
   * @param coords data for a leaflet marker as array with data[0]
   * @returns true if the marker data is valid
   */
  isValidMarker({ lat, lon }): boolean {
    const test = (
      lat
      && lon
      && /^-?\d+\.\d*$/.test(lat)
      && /^-?\d+\.\d*$/.test(lon)
    );
    if (test) return true;
    console.error(`${lat}, ${lon} is not a valid marker!`);
    return false;
  }
};
