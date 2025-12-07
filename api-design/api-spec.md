# Analytics API Documentation

## 1. GET /analytics/top-artists

### Descripción
Retorna el ranking de artistas con más regalías (según segundos reproducidos) en los últimos 30 días.

### Método
`GET`

### URL
```
/analytics/top-artists
```

### Query Params (Opcionales)

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| days | number | Rango en días (default: 30) |

### Ejemplo de Request
```http
GET /analytics/top-artists?days=30
```

### Ejemplo de Response
```json
[
  {
    "artistId": "6790fa07cc6afd0b16c3c1c1",
    "artistName": "Bad Bunny",
    "totalSeconds": 502340,
    "plays": 1260
  }
]
```

---

##  2. GET /analytics/top-songs-gt

### Descripción
Retorna las top 10 canciones en Guatemala durante los últimos 7 días.

### Método
`GET`

### URL
```
/analytics/top-songs-gt
```

### Query Params

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| days | number | Días a considerar (default: 7) |
| limit | number | Cantidad de canciones (default: 10) |

### Ejemplo de Request
```http
GET /analytics/top-songs-gt?days=7&limit=10
```

### Ejemplo de Response
```json
[
  {
    "songId": "678bc1f712fc468748428652",
    "title": "Colores",
    "artist": "Feid",
    "plays": 98,
    "uniqueListeners": 54
  }
]
```

---

##  3. GET /analytics/premium-zombies

### Descripción
Retorna usuarios Premium que no han tenido actividad en los últimos 30 días.

### Método
`GET`

### URL
```
/analytics/premium-zombies
```

### Query Params

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| days | number | Rango sin actividad (default: 30) |

### Ejemplo de Request
```http
GET /analytics/premium-zombies?days=30
```

### Ejemplo de Response
```json
[
  {
    "userId": "6790fab77cc6afd0b16c3c1e",
    "username": "juan123",
    "email": "juan@mail.com",
    "country": "GT",
    "subscription": "Premium",
    "lastActive": null
  }
]
```

---

##  4. GET /analytics/reggaeton-demographics

### Descripción
Retorna la distribución de edades de los usuarios que escuchan Reggaeton.

### Método
`GET`

### URL
```
/analytics/reggaeton-demographics
```

### Ejemplo de Response
```json
[
  { "range": "0-15", "count": 21 },
  { "range": "15-20", "count": 42 },
  { "range": "20-30", "count": 87 },
  { "range": "30-40", "count": 53 },
  { "range": "40-50", "count": 10 },
  { "range": "50-100", "count": 3 }
]
```

---

##  5. GET /analytics/heavy-listeners/arjona

### Descripción
Retorna los 5 usuarios que han escuchado más canciones distintas de Ricardo Arjona.

### Método
`GET`

### URL
```
/analytics/heavy-listeners/arjona
```

### Query Params

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| artistId | string | ID del artista (default: Ricardo Arjona) |
| limit | number | Cantidad de usuarios (default: 5) |

### Ejemplo de Request
```http
GET /analytics/heavy-listeners/arjona?limit=5
```

### Ejemplo de Response
```json
[
  {
    "userId": "6790fa077cc6afd0b16c3c1a",
    "username": "maria_gt",
    "country": "GT",
    "subscription": "Premium",
    "distinctSongsCount": 14
  }
]
```

---

## 🛠 Códigos de error comunes

| Código | Descripción |
|--------|-------------|
| 400 | Parámetros inválidos |
| 404 | Datos no encontrados |
| 500 | Error interno del servidor |