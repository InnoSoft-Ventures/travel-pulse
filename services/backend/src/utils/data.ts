import Continent from '../db/models/Continent';

/**
 * Builds a map from continent alias (string) to continent ID (number).
 *
 * Given a map where each key is a continent ID and each value is an array of aliases
 * for that continent, this function creates a new map where each alias points to its
 * corresponding continent ID. This is useful for quickly looking up a continent ID
 * based on any of its known aliases.
 *
 * @param continentCodes - A Map where the key is the continent ID and the value is an array of aliases for that continent.
 * @returns A Map where the key is an alias (string) and the value is the corresponding continent ID (number).
 */
export function buildAliasToContinentIdMap(
	continents: Continent[]
): Map<string, number> {
	const aliasToId = new Map<string, number>();

	for (const continent of continents) {
		for (const alias of continent.aliasList) {
			aliasToId.set(alias, continent.id);
		}
	}

	return aliasToId;
}
