import { db, users } from "./src/index";

const members = [
  { id: "user_member1", name: "Member One", email: "member1@taskflow.dev" },
  { id: "user_member2", name: "Member Two", email: "member2@taskflow.dev" },
  { id: "user_member3", name: "Member Three", email: "member3@taskflow.dev" },
  { id: "user_member4", name: "Member Four", email: "member4@taskflow.dev" },
  { id: "user_member5", name: "Member Five", email: "member5@taskflow.dev" },
];

for (const m of members) {
  try {
    db.insert(users).values({ ...m, createdAt: new Date() }).run();
    console.log("Seeded:", m.id);
  } catch (e: any) {
    console.log("Skip (exists):", m.id);
  }
}