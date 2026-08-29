import { fetchData } from '../src/Requests/fetchSatellite.ts';
import { postSatellite } from '../src/Requests/postSatellite.ts';
import { describe, test, expect } from 'vitest';
import { serverPort } from '../src/constants.tsx';
import axios from 'axios';

describe('fetchData', () => {
  test('should throw when passed a non-string path argument', async () => {
    try {
      const notAString = [];
      expect(await fetchData(notAString)).toThrow();
    } catch (error) {
      expect(error.message).toBe('path argument must be a string');
    }
  });
});

describe('postSatellite', () => {
  test('should throw when passed a non-string noradID argument', async () => {
    try {
      const notAString = [];
      expect(await postSatellite(notAString)).toThrow(notAString);
    } catch (error) {
      expect(error.message).toBe('noradID argument must be a string');
    }
  });
});

describe('Server', () => {
  const testGetResponse = async (path) =>
    await axios.get(`http://localhost:${serverPort}/${path}`, {
      responseType: 'json',
    });
  test('should be online', async () => {
    expect((await testGetResponse('/')).status).toBe(200);
  });

  test('should return 404 when non-existing path is passed to it', async () => {
    try {
      expect((await testGetResponse('nonExistentPath')).status).toBe(404);
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 404');
    }
  });

  describe('add_sat endpoint', () => {
    const testPostResponse = async (id) =>
      await axios.post(`http://localhost:${serverPort}/add_sat`, {
        noradID: id,
      });

    test('should respond with the appropriate error when given a non-number noradID', async () => {
      try {
        const response = await testPostResponse('invalidInput');
        expect(response).toBe('noradID must be a number!');
        expect(response.status).toBe(400);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400');
      }
    });

    test('should respond with the appropriate error when given a float number noradID', async () => {
      try {
        const response = await testPostResponse(0.5);
        expect(response).toBe('noradID must be a whole number!');
        expect(response.status).toBe(400);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400');
      }
    });

    test('should respond with the appropriate error when given a negative number noradID', async () => {
      try {
        const response = await testPostResponse(-1);
        expect(response).toBe('noradID must be a positive number!');
        expect(response.status).toBe(400);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400');
      }
    });

    test('should respond with a success when given an appropriate noradID', async () => {
      const response = await testPostResponse(5);
      expect(response.status).toBe(200);
    });
  });

  describe('get_by_ids endpoint', () => {
    const path = 'get_by_ids';
    const generateIDStrings = (ids) =>
      ids.reduce((prev, id) => `${prev}ids=${id}&`, '');

    test('should respond with the appropriate error when given non-number noradIDs', async () => {
      try {
        const ids = generateIDStrings(['a', { a: 'a' }, ['b']]);
        const response = await testGetResponse(`${path}?${ids}`);

        expect(response).toBe('ids must be numbers!');
        expect(response.status).toBe(400);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400');
      }
    });

    test('should respond with the appropriate error when given floating number noradIDs', async () => {
      try {
        const ids = generateIDStrings([5.4, 0.3, 0.01]);
        const response = await testGetResponse(`${path}?${ids}`);

        expect(response).toBe('ids must be whole numbers!');
        expect(response.status).toBe(400);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400');
      }
    });

    test('should respond with the appropriate error when given negative number noradIDs', async () => {
      try {
        const ids = generateIDStrings([-3, -1, 0]);
        const response = await testGetResponse(`${path}?${ids}`);

        expect(response).toBe('ids must be positive numbers!');
        expect(response.status).toBe(400);
      } catch (error) {
        expect(error.message).toBe('Request failed with status code 400');
      }
    });

    test('should response with a success when given an appropriate noradID', async () => {
      const ids = generateIDStrings([5, 123]);
      const response = await testGetResponse(`${path}?${ids}`);

      expect(response.status).toBe(200);
    });
  });
});
