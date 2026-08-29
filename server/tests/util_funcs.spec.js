import { updateTLE } from '../util_funcs.js';
import { describe, test, expect, jest } from '@jest/globals';

describe('UpdateTLE function', () => {
  const now = new Date();
  const hourAndHalfAgo = new Date(
    new Date().setHours(now.getHours() - 1, now.getMinutes() - 30),
  );
  const yesterday = new Date(new Date().setDate(now.getDate() - 1));
  const testTLEs = {
    1: {
      name: 'a',
      id: '00001',
      line1: 'abc',
      line2: 'def',
      lastUpdated: yesterday,
    },
    2: {
      name: 'b',
      id: '00002',
      line1: 'abc',
      line2: 'def',
      lastUpdated: hourAndHalfAgo,
    },
    3: {
      name: 'c',
      id: '00003',
      line1: 'abc',
      line2: 'def',
      lastUpdated: now,
    },
  };
  const mockGetData = jest.fn((ids) =>
    ids.map((id) => ({ success: true, contents: id })),
  );
  const mockSplitTLEs = jest.fn((tles) => ({
    [tles[0].contents]: { id: tles[0].contents, lastUpdated: now },
  }));
  const mockSetResponse = jest.fn(() => undefined);

  test('should throw when passed a non-array noradIDs argument', async () => {
    try {
      const notArrayNoradIDs = '';
      expect(await updateTLE(notArrayNoradIDs, testTLEs)).toThrow();
    } catch (error) {
      expect(error.message).toBe('noradIDs argument must be an array');
    }
  });

  test('should throw when passed a non-object TLEs argument', async () => {
    try {
      const notObjectTLEs = '';
      expect(await updateTLE([], notObjectTLEs)).toThrow();
    } catch (error) {
      expect(error.message).toBe('TLEs argument must be an object');
    }
  });

  test('should throw when passed an invalid noradIDs array', async () => {
    try {
      const invalidNoradIDsArray = ['a'];
      expect(await updateTLE(invalidNoradIDsArray, testTLEs)).toThrow();
    } catch (error) {
      expect(error.message).toBe(
        'all ids must be stringified numbers or of type number, a is neither',
      );
    }
  });

  describe('TLEs', () => {
    test('should return as an object', async () => {
      const res = await updateTLE(
        ['1', '002', 3],
        testTLEs,
        mockGetData,
        mockSplitTLEs,
        mockSetResponse,
      );

      expect(res[0] instanceof Object).toBe(true);
    });

    test('should return as the same object when no TLEs were updated', async () => {
      const res = await updateTLE(
        [],
        testTLEs,
        mockGetData,
        mockSplitTLEs,
        mockSetResponse,
      );

      expect(res[0]).toEqual(testTLEs);
    });

    test('should update when they were last updated more than 2 hours ago', async () => {
      const res = await updateTLE(
        ['1', '002', 3],
        testTLEs,
        mockGetData,
        mockSplitTLEs,
        mockSetResponse,
      );

      expect([
        res[0][1].lastUpdated,
        res[0][2].lastUpdated,
        res[0][3].lastUpdated,
      ]).toEqual([now, hourAndHalfAgo, now]);
    });
  });

  describe('fetched data', () => {
    test('should be returned in an array when TLEs were updated', async () => {
      const res = await updateTLE(
        ['1', '002', 3],
        testTLEs,
        mockGetData,
        mockSplitTLEs,
        mockSetResponse,
      );

      expect(res[1] instanceof Array).toBe(true);
    });

    test('should must consist of the getData returns', async () => {
      const res = await updateTLE(
        ['1', '002', 3],
        testTLEs,
        mockGetData,
        mockSplitTLEs,
        mockSetResponse,
      );

      expect(res[1]).toEqual(
        mockGetData.mock.results[mockGetData.mock.results.length - 1].value,
      );
    });

    test('should be returned as null when no TLEs were updated', async () => {
      const res = await updateTLE(
        [],
        testTLEs,
        mockGetData,
        mockSplitTLEs,
        mockSetResponse,
      );

      expect(res[1]).toBe(null);
    });
  });
});
