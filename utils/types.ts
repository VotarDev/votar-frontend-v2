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
  subGroup?: string;
};

export type OptionTypes = {
  label: string;
  value: string;
};
