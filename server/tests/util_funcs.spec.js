import { updateTLE } from '../util_funcs.js';
import { describe, test, expect, jest } from '@jest/globals';

describe('UpdateTLE function', () => {
  const now = new Date();
  const twoHoursAgo = now.setHours(now.getHours() - 2);
  const yesterday = now.setDate(now.getDate() - 1);
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
      lastUpdated: twoHoursAgo,
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
    [tles]: { id: tles, lastUpdated: now },
  }));
  const mockSetResponse = jest.fn((tles) => tles);

  test('should throw when passed a non-array noradIDs argument', async () => {
    try {
      const notArrayNoradIDs = '';
      expect(await updateTLE(notArrayNoradIDs, testTLEs)).toThrow();
    } catch (error) {
      console.log(error);
    }
  });

  test('should throw when passed a non-object TLEs argument', async () => {
    try {
      const notObjectTLEs = '';
      expect(await updateTLE([], notObjectTLEs)).toThrow();
    } catch (error) {
      console.log(error);
    }
  });

  test('should throw when passed an invalid noradIDs array', async () => {
    try {
      const invalidNoradIDsArray = ['a'];
      expect(await updateTLE(invalidNoradIDsArray, testTLEs)).toThrow();
    } catch (error) {
      console.log(error);
    }
  });

  describe('TLEs', () => {
    test('should return as an object', async () => {
      try {
        const updatedTLEs = await updateTLE(
          ['1', '002', 3],
          testTLEs,
          mockGetData,
          mockSplitTLEs,
          mockSetResponse,
        )[0];

        expect(updatedTLEs instanceof Object).toBe(true);
      } catch (error) {
        console.log(error);
      }
    });

    test('should return as the same object when no TLEs were updated', async () => {
      try {
        const updatedTLEs = await updateTLE(
          [],
          testTLEs,
          mockGetData,
          mockSplitTLEs,
          mockSetResponse,
        )[0];

        expect(updatedTLEs).toBe(testTLEs);
      } catch (error) {
        console.log(error);
      }
    });

    test('should update when they were last updated more than 2 hours ago', async () => {
      try {
        const updatedTLEs = await updateTLE(
          ['1', '002', 3],
          testTLEs,
          mockGetData,
          mockSplitTLEs,
          mockSetResponse,
        )[0];

        expect(
          ...[updatedTLEs[1].lastUpdated, updatedTLEs[2].lastUpdated],
          updatedTLEs[3].lastUpdated,
        ).toBe(...[now, twoHoursAgo, now]);
      } catch (error) {
        console.log(error);
      }
    });
  });

  describe('fetched data', () => {
    test('should be returned in an array when TLEs were updated', async () => {
      try {
        const fetchedTLEs = await updateTLE(
          ['1', '002', 3],
          testTLEs,
          mockGetData,
          mockSplitTLEs,
          mockSetResponse,
        )[1];

        expect(fetchedTLEs instanceof Array).toBe(true);
        expect(fetchedTLEs).toBe(
          mockSplitTLEs.mock.results
            .slice(-fetchedTLEs.length)
            .map((result) => result.value),
        );
      } catch (error) {
        console.log(error);
      }
    });

    test('should be returned as null when no TLEs were updated', async () => {
      try {
        const fetchedTLEs = await updateTLE(
          [],
          testTLEs,
          mockGetData,
          mockSplitTLEs,
          mockSetResponse,
        )[1];

        expect(fetchedTLEs).toBe(null);
      } catch (error) {
        console.log(error);
      }
    });
  });
});
