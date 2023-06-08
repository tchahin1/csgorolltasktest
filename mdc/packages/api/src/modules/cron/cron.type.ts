export interface Draw {
  id: number;
  tmsId: number | null;
  name: string;
  teamType: string;
  gender: string;
  results: Result[];
}

export interface Result {
  eventViewModel: null;
  date: Date;
  id: number;
  clubIds: number[];
  players: RemotePlayers;
  videos: string | null;
  round: Round | null;
  sourceType: string;
  completionType: string;
  outcome: string | null;
  isWinner: boolean;
  playerPostedResult: boolean;
  finalized: boolean;
  submittingMemberId: number;
  excludeFromRating: boolean;
  actions: Action;
  isRejected: boolean;
  score: Record<string, Score>;
  winner1Status: string;
  winner2Status: string | null;
  loser1Status: string;
  loser2Status: string | null;
  isFlexLeagueEventPlayerPostDraw: boolean;
  tmsEventDrawMatchId: number | null;
  sportTypeId: number;
  teamType: string;
}

export interface RemotePlayers {
  winner1: Person;
  winner2: Person | null;
  loser1: Person;
  loser2: Person | null;
}

export interface Score {
  winner: string;
  loser: string;
  tiebreak: number | null;
  winnerTiebreak: number | null;
}

export interface HistoricRatings {
  historicSinglesRating: string | null;
  historicSinglesRatingReliability: string | null;
  historicSinglesRatingDate: string | null;
  historicDoublesRating: string | null;
  historicDoublesRatingReliability: string | null;
  historicDoublesRatingDate: string | null;
  historicSinglesRatingDisplay: string;
  historicDoublesRatingDisplay: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  city: string | null;
  state: string | null;
  singlesUtr: number;
  ratingStatusSingles: string;
  ratingProgressSingles: string;
  ratingStatusImgageSingles: string;
  doublesUtr: number;
  singlesUtrDisplay: string;
  doublesUtrDisplay: string;
  myUtrSinglesDisplay: string;
  myUtrDoublesDisplay: string;
  ratingStatusDoubles: string;
  ratingProgressDoubles: string;
  ratingStatusImgageDoubles: string;
  importSource: string | null;
  nationality: string;
  myUtrSingles: number;
  myUtrStatusSingles: string;
  myUtrDoubles: string;
  myUtrStatusDoubles: string;
  memberId: number;
  utrRange: string | null;
  historicRatings: HistoricRatings;
  pbrRatingDisplay: string | null;
}

export interface Round {
  id: number;
  code: string;
  name: string;
  size: number;
  number: number | null;
}

export interface Action {
  delete: {
    allowed: boolean;
  };
  edit: {
    allowed: boolean;
  };
  accept: {
    allowed: boolean;
  };
  reject: {
    allowed: boolean;
  };
  resendInvite: {
    allowed: boolean;
  };
  protest: {
    allowed: boolean;
  };
}

export interface Event {
  id: number;
  name: string;
  isTms: boolean;
  timeZone: null;
  startDate: Date;
  endDate: Date;
  draws: Draw[];
  results: [];
}
