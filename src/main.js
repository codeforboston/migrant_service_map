export const providerToLayerName = provider =>
  provider.properties.type
    .toLowerCase()
    .split(' ')
    .join('-');
