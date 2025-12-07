


// ---------------------------------------------------------------------------
// 1. Top Artists por Regalías (últimos 30 días)
// ---------------------------------------------------------------------------


db.streams.aggregate([
  {
    $match: {
      date: { $gte: new Date(Date.now() - 30*24*60*60*1000) }
    }
  },
  {
    $group: {
      _id: "$artist_id",
      totalSeconds: { $sum: "$seconds_played" },
      plays: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "artists",
      localField: "_id",
      foreignField: "_id",
      as: "artist"
    }
  },
  { $unwind: "$artist" },
  {
    $project: {
      _id: 0,
      artistId: "$_id",
      artistName: "$artist.name",
      totalSeconds: 1,
      plays: 1
    }
  },
  { $sort: { totalSeconds: -1 } }
])



// ---------------------------------------------------------------------------
// 2. Top Songs Guatemala (últimos 7 días)
// ---------------------------------------------------------------------------


db.streams.aggregate([
  {
    $match: {
      date: { $gte: new Date(Date.now() - 7*24*60*60*1000) }
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  { $match: { "user.country": "GT" } },
  {
    $group: {
      _id: "$song_id",
      plays: { $sum: 1 },
      uniqueUsers: { $addToSet: "$user._id" }
    }
  },
  {
    $lookup: {
      from: "songs",
      localField: "_id",
      foreignField: "_id",
      as: "song"
    }
  },
  { $unwind: "$song" },
  {
    $project: {
      _id: 0,
      songId: "$_id",
      title: "$song.title",
      artist: "$song.artist_name",
      plays: 1,
      uniqueListeners: { $size: "$uniqueUsers" }
    }
  },
  { $sort: { plays: -1 } },
  { $limit: 10 }
])


// ---------------------------------------------------------------------------
// 3. Usuarios Premium Zombis (sin actividad en 30 días)
// ---------------------------------------------------------------------------


db.users.aggregate([
  { $match: { subscription: "Premium" } },
  {
    $lookup: {
      from: "streams",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$user_id", "$$userId"] },
                { $gte: ["$date", new Date(Date.now() - 30*24*60*60*1000)] }
              ]
            }
          }
        }
      ],
      as: "recentStreams"
    }
  },
  { $match: { recentStreams: { $size: 0 } } },
  {
    $project: {
      _id: 1,
      username: 1,
      email: 1,
      country: 1,
      subscription: 1,
      lastActive: { $ifNull: [{ $max: "$recentStreams.date" }, null] }
    }
  }
])



// ---------------------------------------------------------------------------
// 4. Demografía del Reggaetón (por edades)
// ---------------------------------------------------------------------------


db.streams.aggregate([
  {
    $lookup: {
      from: "songs",
      localField: "song_id",
      foreignField: "_id",
      as: "song"
    }
  },
  { $unwind: "$song" },
  { $match: { "song.genre": "Reggaeton" } },
  {
    $lookup: {
      from: "users",
      localField: "user_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $addFields: {
      age: {
        $floor: {
          $divide: [
            { $subtract: [new Date(), "$user.birth_date"] },
            1000 * 60 * 60 * 24 * 365
          ]
        }
      }
    }
  },
  {
    $group: {
      _id: "$user._id",
      age: { $first: "$age" }
    }
  },
  {
    $bucket: {
      groupBy: "$age",
      boundaries: [0, 15, 20, 30, 40, 50, 100],
      default: "100+",
      output: {
        count: { $sum: 1 }
      }
    }
  }
])



// ---------------------------------------------------------------------------
// 5. Heavy Listeners de Ricardo Arjona
// ---------------------------------------------------------------------------


db.streams.aggregate([
  {
    $match: {
      artist_id: ObjectId("6935b8b97f797ffb3a2f772f")
    }
  },
  {
    $group: {
      _id: "$user_id",
      uniqueSongs: { $addToSet: "$song_id" }
    }
  },
  {
    $project: {
      distinctSongsCount: { $size: "$uniqueSongs" }
    }
  },
  { $sort: { distinctSongsCount: -1 } },
  { $limit: 5 },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      _id: 0,
      userId: "$_id",
      username: "$user.username",
      country: "$user.country",
      subscription: "$user.subscription",
      distinctSongsCount: 1
    }
  }
])