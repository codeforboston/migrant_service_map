import _ from "lodash";

/**
 * Represents any error generated while loading a provider.
 */
class InvalidProviderError extends Error {
  constructor(messageOrCause) {
    const message = typeof messageOrCause === "string" ? messageOrCause : "";
    super(message);
    this.name = this.constructor.name;
    if (messageOrCause instanceof Error) {
      this.stack = `Unexpected error\n${messageOrCause.stack}`;
    }
  }
}

/**
 * List of all provider types recognized by the app.
 * Provider type names are matched to these values.
 */
const allProviderTypes = {
  jobPlacement: { name: "Job Placement", id: "job-placement" },
  resettlement: { name: "Resettlement", id: "resettlement" },
  health: { name: "Health", id: "health" },
  mentalHealth: { name: "Mental Health", id: "mental-health" },
  legal: { name: "Legal", id: "legal" },
  education: { name: "Education", id: "education" },
  communityCenters: { name: "Community Centers", id: "community-centers" },
  cashFoodAssistance: {
    name: "Cash/Food Assistance",
    id: "cash/food-assistance"
  },
  housing: { name: "Housing", id: "housing" }
};

const allTypeIds = Object.values(allProviderTypes).map(t => t.id);
const typeIdsByNormalizedTypeName = {
  ..._.zipObject(allTypeIds, allTypeIds),
  "community-center": allProviderTypes.communityCenters.id
};
const typeNamesByTypeId = _.fromPairs(
  Object.values(allProviderTypes).map(t => [t.id, t.name])
);

const check = (condition, why, what) => {
  if (!condition) {
    throw new InvalidProviderError(`${why}: ${what}`);
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
    throw new InvalidProviderError(
      `Could not match type name ${typeName} to type ID`
    );
  }
  return typeId;
};

const loadTypeName = typeName => {
  // The type name is valid if it matches an ID.
  let id;
  try {
    id = loadTypeId(typeName);
  } catch (e) {
    throw new InvalidProviderError(`Invalid type name ${typeName}`);
  }
  // Since multiple capitalizations can map to the same ID, return a "canonical" name for the type.
  if (typeNamesByTypeId[id]) {
    return typeNamesByTypeId[id];
  } else {
    throw new InvalidProviderError(`Invalid type name ${typeName}`);
  }
};

const loadCoordinates = c => {
  check(!_.isNil(c), "coordinates must be defined", c);
  const coordinates = Array.from(c);
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
      if (e instanceof InvalidProviderError) {
        throw e;
      }
      throw new InvalidProviderError(e);
    }
    this._loadedProviders.push(provider);
  }

  _getUniqueProviders() {
    return _.uniqWith(
      this._loadedProviders,
      (p1, p2) =>
        _.isEqual(p1.coordinates, p2.coordinates) &&
        _.isEqual(p1.name, p2.name) &&
        _.isEqual(p1.typeId, p2.typeId)
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
    let providersOfSameType;
    for (providersOfSameType of Object.values(providersByTypeId)) {
      const typeId = providersOfSameType[0].typeId;
      providerTypesByTypeId[typeId] = {
        id: typeId,
        name: providersOfSameType[0].typeName,
        providers: providersOfSameType.map(provider => provider.id)
      };
    }
    return providerTypesByTypeId;
  }

  /**
   * Returns an object with providers and providerTypes, as used to initialize the app.
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

export { InvalidProviderError, allProviderTypes, ProviderBuilder };
