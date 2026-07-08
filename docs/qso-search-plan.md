# QSO Search Expansion Plan

## Goal

Expand QSO search from the current callsign-only filter into a query language that:

- searches across multiple QSO fields by default
- supports field-restricted terms via atom prefixes
- supports boolean operators
- supports parentheses for grouping
- remains practical on top of Firestore

## Current State

- `web/src/app/shared/qso-search/qso-search.component.ts` sends a single `call` filter based on the text box.
- `web/src/app/services/qso.service.ts` subscribes to the entire `logbooks/{logbookId}/contacts` collection and filters the in-memory QSO list.
- The current filter model already includes a few exact-match fields (`state`, `country`, `mode`, and date bounds), but the search box only drives callsign matching.
- `firestore/firestore.indexes.json` is empty, so there is no existing Firestore indexing strategy for advanced search.

## Main Constraint: Firestore Is Not a Full Text Search Engine

Firestore can help narrow result sets, but it cannot natively evaluate arbitrary expressions such as:

- free-text search across many fields
- nested boolean logic with `AND`, `OR`, and `NOT`
- grouped expressions with parentheses
- default term expansion across many unrelated fields

Because of that, the most realistic approach is a **hybrid search design**:

1. parse the user query into a structured expression
2. use Firestore only for selective pre-filtering where possible
3. evaluate the full expression against candidate QSOs in application code

## Recommended Search Model

### 1. Define a small query language

Support three kinds of input:

- **bare terms**: searched across the default field set
- **prefixed atoms**: searched only within a named field
- **operators/grouping**: `AND`, `OR`, `NOT`, and parentheses

Examples of intended behavior:

- `k0swe` → search default fields
- `call:k0swe` → search only contacted callsign
- `state:CO AND mode:FT8`
- `(country:Canada OR country:Mexico) AND NOT qsl:lotw`

### 2. Define the searchable field map

Create a single canonical mapping between user-facing prefixes and QSO fields. A first pass could include:

- `call` → `contactedStation.stationCall`
- `name` → `contactedStation.opName`
- `city` → `contactedStation.city`
- `state` → `contactedStation.state`
- `country` → `contactedStation.country`
- `grid` → `contactedStation.gridSquare`
- `mode` → `mode` and `submode`
- `band` → `band`
- `comment` → `comment`
- `notes` → `notes`
- `contest` → `contest.contestId`

The default unprefixed search should cover the small set of fields that users are most likely to expect, rather than every field in the QSO schema.

### 3. Normalize values before searching

Define one normalization rule set for both indexed data and query terms:

- uppercase text
- trim whitespace
- collapse repeated internal whitespace
- normalize punctuation handling
- decide which fields use exact match versus token/substring match

This avoids different behavior between client filtering and Firestore-assisted filtering.

## Execution Strategy

### Phase 1: Build the query engine against the existing in-memory dataset

The lowest-risk first step is to keep the existing `onSnapshot` subscription and replace the current callsign filter with:

1. a tokenizer
2. a parser that produces an expression tree
3. an evaluator that checks whether a QSO matches that tree

This phase delivers the new user-facing behavior quickly:

- multi-field default search
- prefixed atoms
- boolean operators
- parentheses

It also keeps the implementation aligned with how the app already loads QSOs today.

### Phase 2: Add Firestore-aware pre-filtering for scale

If logbooks grow large enough that client-only evaluation becomes slow, add a candidate-reduction layer before the final in-memory evaluation.

The parser output should be analyzed to identify the most selective atoms, such as:

- exact `state`, `country`, `band`, or `mode`
- date ranges
- token matches against precomputed search arrays

Those atoms can drive Firestore queries that fetch a smaller candidate set, after which the full expression is still evaluated locally for correctness.

## Firestore Data Strategy

### Option A: Keep search metadata on each contact document

Add a denormalized search section to each QSO document, containing:

- normalized exact fields for equality checks
- token arrays per important field
- one combined token array for default search

This keeps reads simple because candidate QSOs and search metadata live together.

### Option B: Maintain a parallel search projection

Store a separate search document per QSO with only normalized searchable content and lookup metadata.

This reduces coupling with the primary QSO shape, but increases write complexity because two documents must stay in sync.

### Recommendation

Start with **Option A** unless document size becomes a problem. It is simpler to reason about, simpler to secure with the existing logbook rules, and easier to consume from the current Angular service.

## How Firestore Would Help

To support server-assisted narrowing, precompute searchable fields such as:

- `search.defaultTokens`
- `search.callTokens`
- `search.nameTokens`
- `search.state`
- `search.country`
- `search.mode`
- `search.band`
- `search.timeOnDay` or other normalized date keys

Then use Firestore only for the subset of operations it handles well:

- equality filters
- range filters
- `array-contains`
- `array-contains-any` for a small number of terms

The final boolean interpretation should still happen in application code so the query language is not constrained by Firestore semantics.

## Indexing and Write Path

### 1. Populate search metadata on write

Whenever a QSO is created or updated, also update its normalized search fields.

That can be done either:

- in the Angular client before `addOrUpdate`, or
- in a backend function triggered by QSO writes

The backend-triggered approach is safer because it guarantees consistent normalization regardless of which writer created the QSO.

### 2. Add Firestore indexes only for supported pre-filters

Once the selective atoms are chosen, add only the composite indexes needed for common combinations such as:

- logbook scope plus date
- logbook scope plus exact mode or band
- logbook scope plus token array lookups where practical

This should be driven by actual supported server-side prefilters, not by the full query language surface.

## UI and UX Plan

### Search box behavior

- keep a single search box
- update the hint text to explain the new syntax
- consider a help popover or examples menu
- preserve the clear button and WSJT-X integration

### WSJT-X integration

When WSJT-X sync writes a callsign into the box, treat it as a bare term or explicitly as `call:<value>`. The choice should be documented and kept consistent with user expectations.

### Error handling

- invalid syntax should not silently return no results
- parse errors should show a short, local error message
- unmatched parentheses and unknown prefixes should be explained plainly

## Testing Plan

Add tests at three layers:

1. **tokenizer/parser tests** for operators, prefixes, quotes, and parentheses
2. **evaluator tests** against representative QSO fixtures
3. **service/component tests** proving that query text updates the displayed QSO list correctly

Important cases to cover:

- default multi-field matches
- field-restricted matches
- mixed-case input
- `AND`/`OR` precedence
- nested parentheses
- `NOT` behavior
- empty input
- invalid input

## Suggested Delivery Sequence

1. Expand the filter model from simple field flags to a parsed search expression.
2. Implement the tokenizer, parser, and in-memory evaluator.
3. Replace the current callsign-only wiring in the search component.
4. Add syntax help and user-facing validation messages.
5. Measure performance on realistic logbook sizes.
6. If needed, add denormalized search metadata and Firestore pre-filtering.
7. Add only the Firestore indexes required by that pre-filtering strategy.

## Recommended First Milestone

The best first milestone is to ship the full query language **without changing the backend read model**, because the app already loads QSOs into memory. That delivers the requested feature quickly and keeps the behavior flexible. After that, Firestore-specific indexing and candidate reduction can be added as a second milestone if performance data shows it is necessary.
