export type BallotCandidate = {
  candidate_name: string;
  candidate_nickname: string;
  candidate_picture: string;
  media: string;
  more_details?: string;
  votes: number;
  _id: string;
};

export type BallotPosition = {
  allow_abstain: boolean;
  author_id: string;
  candidates: BallotCandidate[];
  name_of_position: string;
  show_pictures: boolean;
  _id: string;
  __v: number;
};

export type SelectedCandidates = {
  position: string;
  candidates: BallotCandidate[];
  abstain?: boolean;
};
