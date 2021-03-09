export function seedDatabase(firebase) {
  firebase
    .firestore()
    .collection("users")
    .add({
      userId: "ezzz",
      username: "test",
      fullName: "test",
      emailAddress: "test@gailc.om",
      following: ["2"],
      followers: ["2", "3", "4"],
      dateCreated: Date.now(),
    });
}
