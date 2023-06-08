export enum PLAYER_SIDE_LONG {
  UP = 'up',
  DOWN = 'down',
}

export enum PLAYER_SIDE_LAT {
  DEUCE = 'deuce',
  AD = 'ad',
}

export enum TYPE_OF_HIT {
  FIRST_SERVE = 'first_serve',
  SECOND_SERVE = 'second_serve',
  FOREHAND = 'forehand',
  BACKHAND = 'backhand',
}
type KincubeCoordinates = [number, number];

export class KincubeVideoInfo {
  num_frames: number;
  checksum: string;
  fps: number;
  shape: KincubeCoordinates;
  codec: number;
  video_file: string;
  duration: string;
  orientation: string;
  size: number;
  num_channels: number;
  bitrate: number;
  s3_address: string;
  s3_bucket: {
    prefix: string;
    region: string;
  };
  online_address: string;
}

export class KincubeResultHit {
  hitter: PLAYER_SIDE_LONG;
  type_of_hit: TYPE_OF_HIT;
  rebound_before_hit: boolean;
  speed: number | null;
  hitter_zone: number;
  hitter_coordinates: KincubeCoordinates;
  receiver_coordinates: KincubeCoordinates | null;
  rebound_after_hit_zone: number | null;
  rebound_after_hit_coordinates: KincubeCoordinates | null;
  net: boolean;
  band: boolean;
  rebound_after_hit_is_in: boolean;
  hit_winner: boolean;
  timestamp: number;
  next_event_timestamp: number;
  rebound_distance_to_court: number | null;
  expected_adversary_speed: number | null;
}

export class KincubeMatchResult {
  server_side_long: PLAYER_SIDE_LONG;
  server_side_lat: PLAYER_SIDE_LAT;
  winner: PLAYER_SIDE_LONG;
  timestamp: number[];
  hits: KincubeResultHit[];
  first_serve: boolean;
  player_A_is_down: boolean;
  begin_score: number[];
  end_score: number[];
  nb_fictive_points: number;
}

class CameraPosition {
  frames: number[];
  position: number[];
}
export class KincubeResult {
  email: string;
  path: string;
  bucket: string;
  videoInfo: KincubeVideoInfo;
  performance: unknown;
  final_joints: unknown;
  right_left_handed: unknown;
  camera_positions: CameraPosition[];
  side_changing_frames: CameraPosition[];
  result: KincubeMatchResult[];
  output_movie: string;
  thumbnail: string;
  thumbnail_key: string;
  particular_cases: string[];
}
