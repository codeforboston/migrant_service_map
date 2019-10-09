import _ from "lodash";

class InvalidProviderError extends Error {}

/**
 * List of all provider types recognized by the app and their type ID's.
 * Provider type names are matched to these values.
 */
const ALL_PROVIDER_TYPES = {
  jobPlacement: "job-placement",
  resettlement: "resettlement",
  health: "health",
  mentalHealth: "mental-health",
  legal: "legal",
  education: "education",
  communityCenters: "community-centers",
  cashFoodAssistance: "cash/food-assistance",
  housing: "housing"
};

const allTypeIds = Object.values(ALL_PROVIDER_TYPES);
const typeIdsByNormalizedTypeName = {
  ..._.zipObject(allTypeIds, allTypeIds),
  "community-center": ALL_PROVIDER_TYPES.communityCenters
};

const check = (condition, why, what) => {
  if (!condition) {
    throw Error(`${why}: ${what}`);
  }
};

const loadString = (name, string) => {
  check(typeof string === "string", `${name} must be a string`, string);
  check(string.length, `${name} must be nonempty`, string);
  return string;
};

const loadTypeId = typeName => {
  const normalizedTypeName = String(typeName)
      .toLowerCase()
      .replace(/ /, "-"),
    typeId = typeIdsByNormalizedTypeName[normalizedTypeName];
  if (!typeId) {
    throw Error(`Could not match type name ${typeName} to type ID`);
  }
  return typeId;
};

const loadTypeName = typeName => {
  // The type name is valid if we can use it to load the type id.
  try {
    loadTypeId(typeName);
  } catch (e) {
    throw Error(`Invalid type name ${typeName}`);
  }
  return String(typeName);
};

const loadCoordinates = c => {
  coordinates = Array.of(c);
  check(coordinates.length === 2, "Expected [lon, lat]", coordinates);
  check(
    typeof coordinates[0] === "number" &&
      coordinates[0] >= -180 &&
      coordinates[0] <= 180,
    "Expected [lon, lat]",
    coordinates
  );
  check(
    typeof coordinates[1] === "number" &&
      coordinates[1] >= -90 &&
      coordinates[1] <= 90,
    "Expected [lon, lat]",
    coordinates
  );
  return coordinates;
};

/**
 * Validates and creates objects representing service providers and organizes them by type.
 */
class ProviderBuilder {
  constructor() {
    this._loadedProviders = [];
  }

  /**
   * Adds a provider to the overall set of providers.
   *
   * @throws InvalidProviderError if any of the fields are invalid.
   */
  addProvider({
    coordinates,
    address,
    email = "n/a",
    mission,
    name,
    telephone = "n/a",
    timestamp,
    typeName,
    website = "n/a"
  }) {
    let provider;
    try {
      provider = {
        coordinates: loadCoordinates(coordinates),
        address: loadString("address", address),
        email: loadString("email", email),
        name: loadString("name", name),
        mission: loadString("mission", mission),
        telephone: loadString("telephone", telephone),
        website: loadString("website", website), // check URL?
        timestamp: loadString("timestamp", timestamp), // check can parse to Date?
        typeName: loadTypeName(typeName),
        typeId: loadTypeId(typeName)
      };
    } catch (e) {
      throw InvalidProviderError(`Invalid provider ${e}`);
    }
    this._loadedProviders.push(provider);
  }

  _getUniqueProviders() {
    return _.uniqWith(
      this._loadedProviders,
      (p1, p2) =>
        _.isEqual(p1.coordinates, p2.coordinates) && _.isEqual(p1.name, p2.name)
    );
  }

  _getProvidersById(providers) {
    const providersById = {};
    let id = 0;
    providers.forEach(provider => {
      provider.id = id++;
      providersById[provider.id] = provider;
    });
    return providersById;
  }

  _getProviderTypesByTypeId(providers) {
    const providersByTypeId = _.groupBy(providers, provider => provider.typeId);
    const providerTypesByTypeId = {};
    for (providersOfSameType of Object.values(providersByTypeId)) {
      const typeId = providersOfSameType[0].typeId;
      providerTypesByTypeId[typeId] = {
        id: typeId,
        // TODO: use a canonical name rather than what's represented in the data.
        name: providersOfSameType[0].typeName,
        providers: providersOfSameType.map(provider => provider.id)
      };
    }
    return providerTypesByTypeId;
  }

  /**
   * Returns an object with providers and providerTypes, as used to initialize thge app.
   *
   * This should be called once, after adding all providers.
   */
  build() {
    const uniqueProviders = this._getUniqueProviders(),
      providersById = this._getProvidersById(uniqueProviders),
      providerTypesByTypeId = this._getProviderTypesByTypeId(uniqueProviders);

    return {
      providers: { byId: providersById },
      providerTypes: {
        allIds: Object.keys(providerTypesByTypeId),
        byId: providerTypesByTypeId
      }
    };
  }
}

export { InvalidProviderError, ALL_PROVIDER_TYPES, ProviderBuilder };
