# BG Battle utils

## Data

### bgs.json

Rewards backgrounds from steam
format:
```
{
  "appid": 1615290,
  "defid": 166746,
  "type": 1,
  "community_item_class": 3,
  "community_item_type": 16,
  "point_cost": "500",
  "timestamp_created": 1651610284,
  "timestamp_updated": 1651702585,
  "timestamp_available": 0,
  "timestamp_available_end": 0,
  "quantity": "1",
  "internal_description": "Background_05",
  "active": true,
  "community_item_data": {
    "item_name": "Lovely Customers",
    "item_title": "Lovely Customers",
    "item_image_large": "b4f6cbf950fb1972df0b28a6f0b26f93e046e2c3.jpg",
    "animated": false
  },
  "usable_duration": 0,
  "bundle_discount": 0
}
```

### animated.json
bgs.json but only animated ones

### apps.json
apps info from steam
```
{"applist":{"apps":[{"appid":1231990,"name":"Gestalt: Steam & Cinder"}]}}
```

### bgs_with_points.json

Backgrounds from steam tools merged with points info from bgs.json

### filtered.json

bgs_with_points.json but only bright ones

### static.json
bgs.json but only static ones


## Scripts

### addPointsToBackgrounds.ts
Adds points from steam bgs to steam.tools bgs

### filterBright.ts
Filters bgs with points to get only bright ones

### getAllAppgs.ts
Gets all apps from steam

### getAllBackgrounds.ts
Gets all backgrounds from steam

### getSteamToolsBackgrounds.ts
Gets backgrounds from steam.tools

### insertAnimated
Inserts content of animated.json to db