import { fetchData } from '../src/Requests/fetchSatellite.ts';
import { postSatellite } from '../src/Requests/postSatellite.ts';
import { describe, test, expect } from 'vitest';
import { serverPort } from '../src/constants.tsx';

describe('fetchData', () => {
  test('should throw when passed a non-string path argument', async () => {
    try {
      const notAString = [];
      expect(await fetchData(notAString)).toThrow();
    } catch (error) {
      console.log(error);
    }
  });
});

describe('postSatellite', () => {
  test('should throw when passed a non-string noradID argument', async () => {
    try {
      const notAString = [];
      expect(await postSatellite(notAString)).toThrow(notAString);
    } catch (error) {
      console.log(error);
    }
  });
});

describe('Server', () => {
  const testResponse = async (path) =>
    await fetch(`http://${serverPort}${path}`).then((response) => response);
  test('should be online', async () => {
    try {
      expect((await testResponse('/')).status).toBe(200);
    } catch (error) {
      console.log(error);
    }
  });

  test('should return 404 when non-existing path is passed to it', async () => {
    try {
      expect((await testResponse('/nonExistentPath')).status).toBe(404);
    } catch (error) {
      console.log(error);
    }
  });
});
