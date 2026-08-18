export const fetchSatelliteTLE = async (norad_id) => {
  try {
    const tle = await fetch(
      `https://celestrak.org/NORAD/elements/gp.php?CATNR=${norad_id}&FORMAT=TLE`,
    ).then((res) => res.text());

    if (tle === 'No GP data found') {
      throw new Error('No GP data found');
    }

    return { success: true, contents: tle };
  } catch (e) {
    console.log(e.message);
    return { success: false, contents: e.message };
  }
};
