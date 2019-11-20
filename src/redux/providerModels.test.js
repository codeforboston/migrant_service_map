import {
  ProviderBuilder,
  InvalidProviderError,
  allProviderTypes
} from "./providerModels";

// Returns minimal valid provider fields plus any passed in.
const providerFields = rest => ({
  coordinates: [70, 40],
  address: "123 North Street",
  email: "howdydo@gmail.com",
  mission: "noble mission",
  name: "Howdy Do",
  telephone: "555-555-5555",
  timestamp: "April 1 2019",
  typeName: allProviderTypes.jobPlacement.name,
  website: "example.com",
  ...rest
});

const runBuilderWith = rest => {
  const builder = new ProviderBuilder();
  const fields = providerFields(rest);
  builder.addProvider(fields);
  return builder;
};

it("requires required fields", () => {
  expect(() => runBuilderWith({ coordinates: undefined })).toThrow(
    InvalidProviderError
  );
  expect(() => runBuilderWith({ address: undefined })).toThrow(
    InvalidProviderError
  );
  expect(() => runBuilderWith({ mission: undefined })).toThrow(
    InvalidProviderError
  );
  expect(() => runBuilderWith({ name: undefined })).toThrow(
    InvalidProviderError
  );
  expect(() => runBuilderWith({ timestamp: undefined })).toThrow(
    InvalidProviderError
  );
  expect(() => runBuilderWith({ typeName: undefined })).toThrow(
    InvalidProviderError
  );
});

it("rejects empty string fields", () => {
  expect(() => runBuilderWith({ address: "" })).toThrow(InvalidProviderError);
  expect(() => runBuilderWith({ mission: "" })).toThrow(InvalidProviderError);
  expect(() => runBuilderWith({ name: "" })).toThrow(InvalidProviderError);
  expect(() => runBuilderWith({ timestamp: "" })).toThrow(InvalidProviderError);
  expect(() => runBuilderWith({ typeName: "" })).toThrow(InvalidProviderError);
  expect(() => runBuilderWith({ email: "" })).toThrow(InvalidProviderError);
  expect(() => runBuilderWith({ telephone: "" })).toThrow(InvalidProviderError);
  expect(() => runBuilderWith({ website: "" })).toThrow(InvalidProviderError);
});

it("does not require optional fields", () => {
  runBuilderWith({ email: undefined });
  runBuilderWith({ telephone: undefined });
  runBuilderWith({ website: undefined });
});

it("rejects wonky coordinates", () => {
  [[], [2], [360, 0], [0, 360], [null, 0], [0, null], ["20", 0], [0, "20"]].map(
    c =>
      expect(() => runBuilderWith({ coordinates: c })).toThrow(
        InvalidProviderError
      )
  );
});

it("rejects wonky type names", () => {
  ["My unrecognized service", "Childcare", ""].map(c =>
    expect(() => runBuilderWith({ coordinates: c })).toThrow(
      InvalidProviderError
    )
  );
});

it("builds a single provider", () => {
  const builder = runBuilderWith({ typeName: allProviderTypes.legal.name });
  const p = builder.build();

  expect(Object.keys(p.providers.byId)).toEqual(["0"]);
  const singleProvider = p.providers.byId[0];
  expect(singleProvider).toMatchObject(
    providerFields({
      typeName: allProviderTypes.legal.name,
      typeId: allProviderTypes.legal.id,
      id: 0
    })
  );
});

it("normalizes type names", () => {
  const builder = runBuilderWith({ typeName: "LeGaL" });
  const p = builder.build();

  expect(p.providers.byId[0].typeName).toEqual(allProviderTypes.legal.name);
});

it("uses unique, increasing ids starting at 0", () => {
  const builder = new ProviderBuilder(),
    p1 = providerFields({ name: "Johnny" }),
    p2 = providerFields({ name: "Joyce" });
  builder.addProvider(p1);
  builder.addProvider(p2);
  const p = builder.build();

  expect(Object.keys(p.providers.byId)).toEqual(["0", "1"]);
  expect(p.providers.byId[0]).toMatchObject(Object.assign({ id: 0 }, p1));
  expect(p.providers.byId[1]).toMatchObject(Object.assign({ id: 1 }, p2));
});

it("correctly groups providers by type", () => {
  const builder = new ProviderBuilder(),
    p1 = providerFields({ name: "Johnny", typeName: "ReSeTtLeMeNt" }),
    p2 = providerFields({
      name: "Joyce",
      typeName: allProviderTypes.housing.name
    }),
    p3 = providerFields({
      name: "Jane",
      typeName: allProviderTypes.resettlement.name
    });
  builder.addProvider(p1);
  builder.addProvider(p2);
  builder.addProvider(p3);

  const p = builder.build();

  expect(p.providers.byId).toMatchObject({
    0: {
      typeId: allProviderTypes.resettlement.id
    },
    1: {
      typeId: allProviderTypes.housing.id
    },
    2: {
      typeId: allProviderTypes.resettlement.id
    }
  });

  expect(p.providerTypes.allIds).toEqual([
    allProviderTypes.resettlement.id,
    allProviderTypes.housing.id
  ]);

  expect(p.providerTypes.byId).toMatchObject({
    [allProviderTypes.resettlement.id]: {
      id: allProviderTypes.resettlement.id,
      name: allProviderTypes.resettlement.name,
      providers: [0, 2]
    },
    [allProviderTypes.housing.id]: {
      id: allProviderTypes.housing.id,
      name: allProviderTypes.housing.name,
      providers: [1]
    }
  });
});

it("deduplicates providers", () => {
  const builder = new ProviderBuilder(),
    p1 = providerFields({
      name: "Duplicated Provider",
      coordinates: [0, 0],
      typeName: allProviderTypes.resettlement.name
    }),
    p2 = providerFields({
      name: "Duplicated Provider",
      coordinates: [0, 0],
      typeName: allProviderTypes.resettlement.name
    }),
    p3 = providerFields({
      name: "Different Coordinates Provider",
      coordinates: [0, 0],
      typeName: allProviderTypes.resettlement.name
    }),
    p4 = providerFields({
      name: "Different Coordinates Provider",
      coordinates: [0, 1],
      typeName: allProviderTypes.resettlement.name
    }),
    p5 = providerFields({
      name: "Different Type Name Provider",
      coordinates: [0, 0],
      typeName: allProviderTypes.resettlement.name
    }),
    p6 = providerFields({
      name: "Different Type Name Provider",
      coordinates: [0, 0],
      typeName: allProviderTypes.housing.name
    });

  builder.addProvider(p1);
  builder.addProvider(p2);
  builder.addProvider(p3);
  builder.addProvider(p4);
  builder.addProvider(p5);
  builder.addProvider(p6);

  const providers = Object.values(builder.build().providers.byId);

  // p2 is omitted
  expect(providers.length).toEqual(5);
  expect(providers).toMatchObject([p1, p3, p4, p5, p6]);
});
