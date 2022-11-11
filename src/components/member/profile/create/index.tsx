import { IFormData } from "./types";
import { atom, useAtom } from "jotai";

export const formAtom = atom<IFormData>({
  fullName: "",
  username: "",
  dateOfBirth: "",
  state: "",
  city: "",
  email: "",
  phoneNumber: "",
  instagram: "",
  profilePicture: "",
  website: "",
  about: "",
  yearsOfExperience: 0,
  services: [],
  tags: [],
  travelPreference: "BASE",
  survey: {},
});

export default function MemberCreateProfile() {
  return <></>;
}
