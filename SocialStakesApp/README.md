# SocialStakes App

A social betting platform built with React Native and Expo, allowing users to create and participate in friendly bets with points.

## Features

- User authentication with email and password
- Create and manage bets
- Real-time leaderboard
- User profiles with statistics
- Points-based betting system

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Supabase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd SocialStakesApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Replace `your_supabase_url` and `your_supabase_anon_key` with your Supabase project credentials

4. Set up Supabase:
- Create a new Supabase project
- Run the following SQL commands in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0,
  total_bets INTEGER DEFAULT 0,
  won_bets INTEGER DEFAULT 0,
  rank INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create bets table
CREATE TABLE bets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  creator_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'active',
  outcome TEXT,
  participants INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create bet participants table
CREATE TABLE bet_participants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  bet_id UUID REFERENCES bets(id),
  user_id UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  UNIQUE(bet_id, user_id)
);

-- Create weekly leaderboard view
CREATE VIEW weekly_leaderboard AS
SELECT
  p.id,
  p.username,
  p.avatar_url,
  COUNT(DISTINCT b.id) as bets_this_week,
  SUM(CASE WHEN b.outcome = 'won' THEN b.amount ELSE 0 END) as points
FROM profiles p
LEFT JOIN bet_participants bp ON bp.user_id = p.id
LEFT JOIN bets b ON b.id = bp.bet_id
WHERE b.created_at >= date_trunc('week', NOW())
GROUP BY p.id, p.username, p.avatar_url
ORDER BY points DESC;

-- Create function to update user ranks
CREATE OR REPLACE FUNCTION update_user_ranks()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET rank = ranks.rank
  FROM (
    SELECT id, ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank
    FROM profiles
  ) ranks
  WHERE profiles.id = ranks.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update ranks when points change
CREATE TRIGGER update_ranks_trigger
AFTER UPDATE OF total_points ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_user_ranks();
```

5. Start the development server:
```bash
npm start
# or
yarn start
```

## Running the App

1. Install the Expo Go app on your iOS or Android device
2. Scan the QR code from the terminal with your device's camera
3. The app will load on your device

## Development

- `app/` - Contains all the screens and components
- `contexts/` - React Context providers
- `lib/` - Utility functions and API clients
- `navigation/` - Navigation configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 