export interface CleanedTikTokData {
  id: string;
  raw_id: string | null;
  url: string;
  caption: string | null;
  views: string | null;
  category: string;
  confidence: number | null;
  region: string | null;
  status: string | null;
  cleaned_at: string | null;
  created_at: string | null;
  place_name: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
}
