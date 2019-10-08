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

const providerPropertyLoaders = {
  coordinates: c => {
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
  },
  address: address => loadString("address", address),
  email: email => loadString("email", email),
  name: name => loadString("name", name),
  mission: mission => loadString("mission", mission),
  telephone: telephone => loadString("telephone", telephone),
  website: website => loadString("website", website), // check URL?
  timestamp: timestamp => loadString("timestamp", timestamp), // check can parse to Date?
  typeName: typeName => {
    // check that can resolve to a known type ID, return typeName
  },
  typeId: typeName => {
    // check that can resolve to a known type ID, return id
  }
};

class ProviderLoader {
  constructor() {
    this.currentId = 0;
    this.loadedProviders = [];
  }

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
    const load = providerPropertyLoaders;
    try {
      provider = {
        coordinates: load.coordinates(coordinates),
        address: load.address(address),
        email: load.email(email),
        name: load.name(name),
        mission: load.mission(mission),
        telephone: load.telephone(telephone),
        timestamp: load.timestamp(timestamp),
        typeName: load.typeName(typeName),
        website: load.website(website),
        typeId: load.typeId(typeName)
      };
    } catch (e) {
      console.warn(`Could not load provider data ${arguments[0]}: ${e}`);
      return;
    }
    this.loadedProviders.push(provider);
  }
}

class Provider {
  constructor({
    address,
    color,
    coordinates,
    email,
    id, // Must be unique among providers
    mission,
    name,
    telephone,
    timestamp,
    typeId,
    typeName,
    website
  }) {}
}
