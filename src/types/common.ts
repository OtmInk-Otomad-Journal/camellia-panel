export type pullData = {
  ranking: string;
  score: string;
  aid: string;
  bvid: string;
  cid: string;
  title: string;
  uploader: string;
  uid: string;
  copyright: string;
  play: string;
  like: string;
  coin: string;
  star: string;
  pubtime: string;
  adjust_scale: string;
  prescore: string;
  part: string;
  duration: string;
  start_time: string;
  full_time: string;
  web_prefix: string;
  video_src: string;
  cover_src: string;
  avatar_src: string;
  danmaku_src: string;
  light_color: string;
  dark_color: string;
  score_add: string;
};

export type pickData = {
  status: boolean;
  aid: string | number;
  reason: string;
  picker: string;
  activity: string;
};

export type fetchData = {
  id: number;
  work: string;
  reason: string;
  anonymous: number;
  bynote: null;
  created_at: string;
  updated_at: string;
  nickname: string;
  user_id: number;
  bili_bound: number;
};
