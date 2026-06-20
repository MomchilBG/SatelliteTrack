export const fetchSatelliteTLE = async (norad_id) => {
  try {
    const tle = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?CATNR=${norad_id}&FORMAT=TLE`,
    ).then((res) => res.text());

    return tle;
  } catch (e) {
    console.log(e.message);
  }
};
