-- Create users table for user registration
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own data" 
ON public.users 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create energy_reports table for sample data
CREATE TABLE public.energy_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  street_light_id TEXT NOT NULL,
  energy_consumed_kwh DECIMAL(10,2) NOT NULL,
  energy_saved_kwh DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.energy_reports ENABLE ROW LEVEL SECURITY;

-- Create policies for energy_reports table
CREATE POLICY "Users can view their own reports" 
ON public.energy_reports 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample energy data for testing
INSERT INTO public.energy_reports (user_id, report_date, street_light_id, energy_consumed_kwh, energy_saved_kwh) VALUES
(gen_random_uuid(), '2024-01-15', 'SL001', 12.5, 3.2),
(gen_random_uuid(), '2024-01-16', 'SL002', 15.8, 4.1),
(gen_random_uuid(), '2024-01-17', 'SL003', 18.2, 5.5),
(gen_random_uuid(), '2024-01-18', 'SL001', 14.7, 3.8),
(gen_random_uuid(), '2024-01-19', 'SL004', 22.1, 6.2);