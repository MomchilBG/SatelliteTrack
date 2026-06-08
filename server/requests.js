export const fetchData = async () => {
  try {
    const tles = await fetch(
      'https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE',
    ).then((res) => res.text());

    return tles;
  } catch (e) {
    console.log(e.message);
  }
};
