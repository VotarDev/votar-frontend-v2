import { type } from "os";

export interface PostItem {
  title: string;
  author: string;
  categories: string[];
  content: string;
  description: string;
  guid: string;
  link: string;
  pubDate: string;
  thumbnail: string;
  enclosure: {};
}

export interface searchDemo {
  title: string;
  id: string;
  description: string;
  image: string;
}
export interface Media {
  type: "file" | "image" | "video";
  docs: Blob | MediaSource;
}
export interface Details {
  dets: string;
  media: File[];
}
export interface Candidate {
  candidate_name: string;
  candidate_nickname: string;
  more_details: string;
  candidate_picture: Blob | MediaSource;
  candidate_picture_base64?: string | undefined;
  media: Media;
  votes: number;
  filename: string;
  docsname: string;
}
export interface Position {
  name_of_position: string;
  show_pictures: boolean;
  allow_abstain: boolean;
  candidates: Candidate[];
  election_id: string | undefined | null;
}

export interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export interface StyledTabProps {
  label: string;
}

export type propsType = {
  tracked: {
    oldData: any;
    newData: any;
    changedData: string[];
  }[];
  index: number;
};

export type TrackeChanges = {
  oldData: any;
  newData: any;
  changedData: string[];
};

export type TableRowTypes = {
  id: string | number;
  name: string;
  subGroup: string;
  phoneNumber: string;
  email: string;
};

export type CardRowTypess = {
  id: string | number;
  name: string;
  status: string;
  cardHolder: string;
  cardNumber: string;
  expires: string;
};

export interface ExportToExcelProps {
  excelData: {
    email: string;
    id: string | number;
    name: string;
    phoneNumber: string;
    _id: string;
    isDuplicate?: boolean;
    subGroup?: string;
  }[];
  fileName: string;
  children: React.ReactNode;
  className: string;
}

export type Election = {
  association_logo: string;
  author_id: string;
  createdAt: string;
  description: string;
  election_id: string;
  election_notification: string;
  end_date: string;
  end_time: number;
  max_number_candidate: number;
  name_of_election: string;
  other_details: string;
  primary_color: string;
  secondary_color: string;
  start_date: string;
  start_time: number;
  updatedAt: string;
  elect_background_img: string;
  type: string;
  _id: string;
  __v: number;
};

export type ElectionDetails = {
  amount: number;
  association_logo: string;
  author_id: string;
  createdAt: string;
  description: string;
  election_id: string;
  election_notification: string;
  end_date: string;
  end_time: number;
  max_number_candidate: number;
  name_of_election: string;
  other_details: string;
  primary_color: string;
  secondary_color: string;
  start_date: string;
  start_time: number;
  status: string;
  updatedAt: string;
  elect_background_img: string;
  type: string;
  published: boolean;
  price_per_vote: number;
  free_votes: number;
  __v: number;
  _id: string;
};

export type VoterResponse = {
  email: string;
  id: string | number;
  name: string;
  phoneNumber: string;
  _id: string;
  isDuplicate?: boolean;
  subgroup?: string;
  isExported?: boolean;
};

export type OptionTypes = {
  label: string;
  value: string;
};

export type DetailFormState = {
  electionName: string;
  description: string;
  primary_color: string;
  secondary_color: string;
  image: File | string | null;
  imagePreview: string | null;
  background_image?: File | string | null;
  background_image_preview?: string | null;
  start_date: string | undefined;
  end_date: string | undefined;
  start_time: string | number | undefined;
  end_time: string | undefined | number;
  max_number_candidate: number;
  price_per_vote: number;
  free_votes: number;
};

export type DetailFormAction =
  | { type: "SET_FIELD"; field: keyof DetailFormState; value: string }
  | { type: "SET_IMAGE"; image: File; imagePreview: string }
  | {
      type: "SET_BACKGROUND_IMAGE";
      background_image: File;
      background_image_preview: string;
    }
  | { type: "SET_PRIMARY_COLOR"; value: string }
  | { type: "SET_SECONDARY_COLOR"; value: string }
  | { type: "SET_CANDIDATE_NO"; value: number }
  | { type: "SET_ELECTION"; value: ElectionDetails }
  | { type: "INCREMENT_CANDIDATE_NO"; value: number }
  | { type: "DECREMENT_CANDIDATE_NO"; value: number }
  | { type: "INCREMENT_PRICE_PER_VOTE"; value: number }
  | { type: "DECREMENT_PRICE_PER_VOTE"; value: number }
  | { type: "INCREMENT_FREE_VOTE"; value: number }
  | { type: "DECREMENT_FREE_VOTE"; value: number };
