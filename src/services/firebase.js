import { app, FieldValue } from "../lib/firebase";

export async function doesUsernameExist(username) {
  const result = await app
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.map((user) => user.data().length > 0);
}

export const getUserByUserId = async (userId) => {
  const result = await app
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();

  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
  return user;
};

export const getUserFollowedPhotos = async (userId, followingUserIds) => {
  const result = await app
    .firestore()
    .collection("photos")
    .where("userId", "in", followingUserIds)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;

      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }

      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];

      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
};

export const getSuggestedProfiles = async (userId, following) => {
  const res = await app.firestore().collection("users").limit(10).get();

  return res.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
};

export const updateMyFollowing = async (docId, profileId, isFollowingUser) => {
  return app
    .firestore()
    .collection("users")
    .doc(docId)
    .update({
      following: isFollowingUser
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
};

export const updateFollowedUsersFollowers = async (
  profileDocId,
  userId,
  isFollowingProfile
) => {
  return app
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(userId)
        : FieldValue.arrayUnion(userId),
    });
};

export const getUserByUsername = async (username) => {
  const result = await app
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
};

export const getUserPhotosByUserId = async (userId) => {
  //const [{ userId }] = await getUserByUsername(username);

  const result = await app
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  return photos;
};

export const isUserFollowingProfile = async (loggedInUsername, profileId) => {
  const result = await app
    .firestore()
    .collection("users")
    .where("username", "==", loggedInUsername)
    .where("following", "array-contains", profileId)
    .get();

  const [res = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return res.userId;
};

export const toggleFollow = async (
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) => {
  await updateMyFollowing(activeUserDocId, profileUserId, isFollowingProfile);
  await updateFollowedUsersFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
};

export const createPost = async (userId, username, photoId, caption) => {
  app
    .firestore()
    .collection("photos")
    .add({
      photoId: photoId,
      userId: userId,
      imageSrc: `/images/users/${username}/${photoId}.jpg`,
      caption: caption,
      likes: [],
      comments: [],
      userLatitude: "40.7128°",
      userLongitude: "74.0060°",
      dateCreated: Date.now(),
    });
};

export const getPostByUsernameImageSrc = async (userId, imageSrc) => {
  const result = await app
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .where("imageSrc", "==", imageSrc)
    .get();

  const response = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response;
};
