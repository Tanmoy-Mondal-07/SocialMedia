import { Client, Users, Databases, Query, Permission, Role } from 'node-appwrite';

export default async function main({ req, res, context }) {

  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const users = new Users(client);
  const databases = new Databases(client);

  const DATABASE_ID = process.env.DATABASE_ID;
  const FOLLOWS_COLLECTION_ID = process.env.FOLLOWS_COLLECTION_ID;
  const STATS_COLLECTION_ID = process.env.STATS_COLLECTION_ID;
  const NOTIFICATIONS_COLLECTION_ID = process.env.NOTIFICATIONS_COLLECTION_ID;

  try {
    if (req.method !== 'POST') {
      return res.json({ success: false, error: 'Method Not Allowed. Only POST requests are accepted.' });
    }

    const rawBody = req.body;
    let body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
    const { followeeId } = body;

    const followerId = req.headers['x-appwrite-user-id'];

    if (!followerId || !followeeId) {
      return res.json({ success: false, error: 'Missing user IDs' });
    }

    const existingFollow = await databases.listDocuments(DATABASE_ID, FOLLOWS_COLLECTION_ID, [
      Query.equal('followerId', followerId),
      Query.equal('followeeId', followeeId),
    ]);

    if (existingFollow.total > 0) {
      for (const doc of existingFollow.documents) {
        await databases.deleteDocument(DATABASE_ID, FOLLOWS_COLLECTION_ID, doc.$id);
      }
    } else {
      await databases.createDocument(DATABASE_ID, FOLLOWS_COLLECTION_ID, 'unique()', {
        followerId,
        followeeId,
      });

      try {
        await databases.createDocument(DATABASE_ID, NOTIFICATIONS_COLLECTION_ID, 'unique()', {
          userId: followeeId,
          type: 'follow',
          relatedUserId: followerId,
          relatedPostId: null,
          seen: false
        },
          [
            Permission.read(Role.user(followeeId)),
            Permission.update(Role.user(followeeId)),
            Permission.delete(Role.user(followeeId)), // User followerId can delete this document
          ]
        )
      } catch (error) {
  
      }
    }

    const followersList = await databases.listDocuments(DATABASE_ID, FOLLOWS_COLLECTION_ID, [
      Query.equal('followeeId', followeeId),
    ]);
    const followingList = await databases.listDocuments(DATABASE_ID, FOLLOWS_COLLECTION_ID, [
      Query.equal('followerId', followerId),
    ]);

    const followersCount = followersList.total;
    const followingCount = followingList.total;

    const updateOrCreate = async (id, field, value) => {
      try {
        await databases.updateDocument(DATABASE_ID, STATS_COLLECTION_ID, id, {
          [field]: value,
        });
      } catch (e) {
        if (e.message.includes('Document with the requested ID could not be found')) {
          await databases.createDocument(DATABASE_ID, STATS_COLLECTION_ID, id, {
            followersCount: 0,
            followingCount: 0,
            [field]: value,
          });
        } else {
          throw e;
        }
      }
    };

    await updateOrCreate(followeeId, 'followersCount', followersCount);
    await updateOrCreate(followerId, 'followingCount', followingCount);

    return res.json({
      success: true,
      updated: {
        [followeeId]: { followersCount },
        [followerId]: { followingCount },
      },
    });
  } catch (err) {
    context.error(err);
    return res.json({ success: false, error: err.message });
  }
}
