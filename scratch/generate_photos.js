
const destination_names = [
  "Goa", "Ladakh (Leh)", "Jaipur", "Varanasi (Kashi)", "Agra", "Udaipur",
  "Kerala Backwaters (Alappuzha & Kumarakom)", "Coorg (Kodagu)", "Ziro Valley",
  "Mawlynnong & nearby (including Living Root Bridges region)", "Shimla",
  "Dharamshala & McLeod Ganj", "Manali", "Tawang", "Khajjiar", "Spiti Valley",
  "Nubra Valley", "Pangong Lake (Pangong Tso)", "Ooty (Udhagamandalam)", "Munnar",
  "Kanyakumari", "Rann of Kutch (White Desert, Dhordo)", "Dhanushkodi (Ghost Town & Beach)",
  "Chitrakote Falls", "Gokarna", "Pondicherry (Puducherry)", "Hampi", "Majuli Island",
  "Araku Valley", "Varkala", "Havelock Island (Swaraj Dweep)", "Neil Island (Shaheed Dweep)",
  "Shillong", "Cherrapunji & Mawsmai Area (Sohra region)", "Dawki & Shnongpdeng",
  "Krang Suri Falls", "Rishikesh", "Haridwar", "Varanasi (Kashi)", "Amritsar",
  "Kanatal", "Binsar", "Munsiyari", "Chakrata", "Kanha National Park",
  "Ranthambore National Park", "Bandhavgarh National Park", "Tadoba Andhari Tiger Reserve",
  "Lakshadweep (Agatti–Bangaram–Kadmat circuit)", "Kalpeni Island (Lakshadweep)",
  "Jaisalmer (Thar Desert & Fort Town)", "Kutch Interior Circuit (Bhuj–Mandvi–Villages)",
  "Coorg (Kodagu)", "Wayanad", "Tamhini Ghat & Mulshi", "Mahabaleshwar & Panchgani",
  "Chikmagalur", "Amboli Ghat", "Agumbe & Western Ghats Rainforest Belt",
  "Kudremukh & Surrounding Ghats", "Havelock Island (Swaraj Dweep)",
  "Neil Island (Shaheed Dweep)", "Port Blair & Nearby Islands", "Darjeeling",
  "Gangtok & East Sikkim", "North Sikkim (Lachung–Lachen Belt)",
  "Meghalaya (Shillong–Cherrapunji–Mawlynnong circuit)", "Kaziranga National Park & Assam Tea Belt",
  "Khajuraho & Panna National Park", "Orchha & Nearby Betwa Landscapes", "Gokarna",
  "Almora & Kasar Devi Belt", "Tawang", "Spiti Valley", "Jibhi & Tirthan Valley",
  "Chitkul & Baspa Valley", "Miyar Valley", "Keoladeo National Park (Bharatpur Bird Sanctuary)",
  "Ranganathittu Bird Sanctuary", "Nal Sarovar Bird Sanctuary", "Great Rann of Kutch (White Desert)",
  "Jaisalmer & Thar Desert Dunes", "Maravanthe & Karnataka Offbeat Coast",
  "Astaranga & Ramachandi Beaches (Odisha Quiet Coast)", "Unakoti & North Tripura Heritage Belt",
  "Mamallapuram (Mahabalipuram) & Coromandel Heritage Coast", "Hidden Goa Coves (Butterfly & Nearby Beaches)",
  "Bangaram & Kadmat Islands (Lakshadweep Quiet Beaches)", "Malanad–Malabar Backwater & Rural Belt",
  "Krishna Heritage Circuit (Mathura–Vrindavan–Dwarka Focus)", "Rishikesh & Haridwar (Himalayan Yoga Route)",
  "Varanasi Ganga Ghats Pilgrimage", "Bodh Gaya Buddhist Circuit Hub", "Rameswaram & Pamban Coast (Sacred Water Walk)",
  "Hampi & Pattadakal (UNESCO Vijayanagara–Chalukya Circuit)", "Gulmarg (Kashmir Ski & Snow Destination)",
  "Auli (Garhwal Ski & Snow Resort)", "Tiruvannamalai & Arunachala (Inner Fire Journey)",
  "Amarkantak Nature–Spiritual Loop", "Haridwar–Rishikesh–Char Dham Spiritual Trail (Meta‑Circuit Node)"
];

const photoIds = [
  "1512343879784-a960bf40e7f2", "1506905925346-21bda4d32df4", "1477587458883-47145ed6736c", "1561361058-c24e0b74f2b0", "1564507592333-c60657eea523",
  "1609137144813-7d9921338f24", "1602216056096-3b40cc0c9944", "1596422846543-75c6fc197f0a", "1621213076865-c7e99741e97d", "1599839619722-39751411ea63",
  "1597074866923-dc0589150458", "1627885065096-4122d1bcab15", "1585128792020-803d29415281", "1610014022634-11883bd8bfb8", "1627993077309-8d19760086bc",
  "1616422301323-289b4b0ed17f", "1622308644420-67b67ea3cd3f", "1618218933246-86c3194a0818", "1626621341517-bbf3d9990a23", "1587595431973-159d0b94add1",
  "1590509837014-99214742786a", "1616489953149-8e273030f818", "1626014903700-1c4b8b6fc87b", "1588079538330-751b43a870be", "1600112356915-089bfc5d7981",
  "1587806555194-e0b44b827e7d", "1590073242678-70ee3fc28e8e", "1599839575945-a9e5af0c3fa5", "1605658145452-f633d7b823e2", "1616422285623-1d016ab3a4b0",
  "1590050856264-9477a3df7a76", "1589394815804-7917df03f48c", "1585232004423-0ca24e60a772", "1601053744955-465457c79f18", "1610471926618-97a61d1e4420",
  "1608408453414-72782e4e11e8", "1590766948561-f30a964a3acd", "1620766182966-c6eb5ed2b788", "1599839619722-39751411ea63", "1609947017136-9daf32a5d5e0",
  "1613941457817-5e92592534f3", "1589308078059-be1415eab4c3", "1584742980315-99f7831d6836", "1605649487212-47bdab064df7", "1591873105740-4e311a2f64f8",
  "1585250444367-9359e1208a0d", "1610123165386-8a0a8661640a", "1612458032731-897531779956", "1581413807973-1991448b1d91", "1586598116313-b68e986a4277",
  "1586612438666-ffd90f84a6c2", "1594922129524-71281488c005", "1596422846543-75c6fc197f0a", "1611082590212-9c3f1c4abe58", "1602410881907-8e6d231a4731",
  "1599402129753-3333658514cc", "1601053744955-465457c79f18", "1610471926618-97a61d1e4420", "1608408453414-72782e4e11e8", "1590766948561-f30a964a3acd",
  "1620766182966-c6eb5ed2b788", "1599839619722-39751411ea63", "1609947017136-9daf32a5d5e0", "1590050856264-9477a3df7a76", "1589394815804-7917df03f48c",
  "1585232004423-0ca24e60a772", "1591873105740-4e311a2f64f8", "1585250444367-9359e1208a0d", "1589308078059-be1415eab4c3", "1584742980315-99f7831d6836",
  "1594922129524-71281488c005", "1611082590212-9c3f1c4abe58", "1591873105740-4e311a2f64f8", "1585250444367-9359e1208a0d", "1589308078059-be1415eab4c3",
  "1584742980315-99f7831d6836", "1591873105740-4e311a2f64f8", "1585250444367-9359e1208a0d", "1589308078059-be1415eab4c3", "1584742980315-99f7831d6836",
  "1591873105740-4e311a2f64f8", "1585250444367-9359e1208a0d", "1589308078059-be1415eab4c3", "1584742980315-99f7831d6836", "1591873105740-4e311a2f64f8",
  "1585250444367-9359e1208a0d", "1589308078059-be1415eab4c3", "1584742980315-99f7831d6836", "1591873105740-4e311a2f64f8", "1585250444367-9359e1208a0d",
  "1589308078059-be1415eab4c3", "1584742980315-99f7831d6836", "1591873105740-4e311a2f64f8", "1585250444367-9359e1208a0d", "1589308078059-be1415eab4c3",
  "1584742980315-99f7831d6836", "1591873105740-4e311a2f64f8", "1585250444367-9359e1208a0d", "1589308078059-be1415eab4c3", "1584742980315-99f7831d6836"
];

// I need to ensure 100 UNIQUE photo IDs. I'll just use the ones I have and add some random variation if needed,
// but better yet, I'll search for more unique ones.

// Wait, I'll just manually pick 100 unique IDs from Unsplash for Indian tourism.
// I'll search for "India tourism" photos on Unsplash to get a pool of IDs.

