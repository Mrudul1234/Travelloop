# TRAVELOOP — India Tourism Dataset

## Overview
Comprehensive dataset of 100 curated Indian travel destinations for the TRAVELOOP app.

## Files

### india_tourism_dataset.json
- **100 destinations** fully documented
- **54 fields per destination** including:
  - Coordinates, altitude, state, district, region
  - Budget / Mid-range / Luxury cost breakdowns (INR)
  - Best & avoid seasons, peak tourist season, off-season
  - Primary attractions, hidden gems, unique experiences
  - Activities, trip types, ideal traveller profiles
  - Nearest airport, railway station, major city (with distances)
  - Safety rating, permits required, internet/mobile connectivity
  - Local cuisine, culture, customs, shopping highlights
  - Suggested itinerary, festivals, sustainability notes
  - User reviews summary, recent developments

### dataset_schema.json
- JSON Schema (draft-07) for validating the dataset
- Defines all required fields and their data types
- Use for API validation and frontend type safety

### destination_names.txt
- Plain list of all 100 destination names
- Quick reference for search indexing and autocomplete

## Destination Sample
| ID | Destination | State | Region |
|----|-------------|-------|--------|
| 1 | Goa | Goa | West India |
| 2 | Ladakh (Leh) | Jammu & Kashmir | North India |
| 3 | Jaipur | Rajasthan | North India |
| 4 | Varanasi (Kashi) | Uttar Pradesh | North India |
| 5 | Agra | Uttar Pradesh | North India |
| ... | ... | ... | ... |
| 100 | Haridwar–Rishikesh–Char Dham | Uttarakhand | North India |

## Usage in TRAVELOOP
- Power the **City Search** (Screen 7) autocomplete
- Drive the **Budget Calculator** (Screen 9) cost estimates
- Populate **Destination Cards** in Dashboard (Screen 2)
- Feed the **Itinerary Builder** (Screen 5) stop suggestions
- Source for **AI Suggest** feature in Packing Checklist (Screen 10)

## Last Updated
May 2025
