export type Inputs = {
  identity?: string;
  fullName?: string;
  username?: string;
  dateOfBirth?: string;
  state?: string;
  city?: string;
  email?: string;
  phoneNumber?: string;
  profilePicture?: string;
  instagram?: string;
  website?: string;
  about?: string;
  yearsOfExperience?: number;
  services?: string[];
  tags?: string[];
  travelPreference?: "BASE" | "REGION" | "COUNTRY";
  survey?: {
    id?: string;
    answers?: {
      [key: string]: string | string[];
    };
  };
};

export type IFormData = {
  fullName: string;
  username: string;
  dateOfBirth: string;
  state: string;
  city: string;
  email: string;
  phoneNumber: string;
  instagram: string;
  profilePicture?: string;
  website: string;
  about: string;
  yearsOfExperience: number;
  services: string[];
  tags: string[];
  travelPreference: "BASE" | "REGION" | "COUNTRY";
  survey: any;
};
