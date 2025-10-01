import { type Models } from 'appwrite';

export type Fundraiser = Models.Row & {
  beneficiaryName: string;
  beneficiaryEmail: string;
  organiserPublicKey: string;
  country: string;
  deadline: Date;
  goal: number;
  title: string;
  story: string;
  imageID: string;
  completed: boolean;
};

export type FormData = {
  name: string;
  email: string;
  goal: string;
  country: string;
  deadline: Date;
  title: string;
  story: string;
  image: FileList;
};
