# DAML Cast

Auto-generates a fully-typed OpenAPI spec from any `.dar` file.

## What is this?

The Canton JSON Ledger API has every contract using the same blank endpoints:

```
POST /v1/create
Body: {}   ← no field names, no types, nothing
```

DAML Cast reads your compiled `.dar` file and turns it into this:

```
POST /Agreement/MultiPartyAgreement/create
Body: {
  proposer:        string (daml-party)
  signatories:     array of party
  requiredParties: array of party
  terms:           string
}
```

Paste that into Swagger UI or feed it into `openapi-generator` to get a typed SDK in TypeScript, Python, Java automatically.

## What's in this folder

```
DAML_cast/
  typeMapper.js   - maps Daml types to JSON Schema
  cast.js         - the compiler
  openapi.yaml    - the generated output
  package.json
```

## How to use it

### 1. Prerequisites

- Node.js v18+
- Daml SDK: `curl -sSL https://get.digitalasset.com/install/install.sh | sh`
- A `.dar` file

### 2. Inspect your .dar

```bash
dpm damlc inspect-dar --json your-contract.dar > inspect.json
unzip -p your-contract.dar "*/YourModule.daml"
```

The second command prints the Daml source templates, fields, choices.

### 3. Install dependencies

```bash
cd DAML_cast
npm install
```

### 4. Run Cast

```
node cast.js
```

Output: `openapi.yaml`

### 5. View it

```bash
cat openapi.yaml | pbcopy
```

Paste into **https://editor.swagger.io** — you'll see all your endpoints rendered with types.

## Type mappings

| Daml | JSON Schema | Notes |
|------|-------------|-------|
| `Text` | `string` | |
| `Party` | `string` | Full ID e.g. `Alice::122084...` |
| `ContractId<T>` | `string` | The long hex IDs from the ledger |

and more...

## What was built against

This prototype was built against a Sample .dar file present in the root dir `test-agreement-1.3.0.dar`, Feel free to alter the components based on your .dar needs and choices.

- **Template:** `MultiPartyAgreement`
- **Fields:** `proposer`, `signatories`, `requiredParties`, `terms`
- **Choices:** 
    - `AddParty` (non-consuming)
    - `Close` (consuming)
- **Package ID:** `01da4dba66c232540ae7d1214cc22e32dc89c9f36c114c7f1dec959ce81b66ac`

Generated 4 endpoints, 4 schemas, zero errors in Swagger.