const DAML_PRIMITIVES = {
  'Text':    { type: 'string' },
  'Int':     { type: 'integer', format: 'int64' },
  'Decimal': { type: 'string', format: 'decimal', description: 'Arbitrary precision number, encoded as string' },
  'Bool':    { type: 'boolean' },
  'Party':   { type: 'string', format: 'daml-party', description: 'Daml Party ID e.g. Alice::122084...' },
  'Time':    { type: 'string', format: 'date-time' },
  'Date':    { type: 'string', format: 'date' },
  'Unit':    { type: 'object', description: 'Empty object {}' },
};

function mapType(damlType) {
  if (typeof damlType === 'string') {
    if (DAML_PRIMITIVES[damlType]) return DAML_PRIMITIVES[damlType];
    return { type: 'string', description: `Daml type: ${damlType}` };
  }
  if (damlType.List)     return { type: 'array', items: mapType(damlType.List) };
  if (damlType.Optional) return { oneOf: [{ type: 'null' }, mapType(damlType.Optional)] };
  if (damlType.ContractId) return { type: 'string', format: 'daml-contract-id', description: `ContractId of ${damlType.ContractId}` };
  return { type: 'object', description: `Unknown type: ${JSON.stringify(damlType)}` };
}

module.exports = { mapType };
