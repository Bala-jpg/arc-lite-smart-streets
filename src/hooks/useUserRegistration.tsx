import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
}

export const useUserRegistration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    checkUserRegistration();
  }, [user]);

  const checkUserRegistration = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking user registration:', error);
        return;
      }

      if (data) {
        setIsRegistered(true);
        setUserData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email
        });
      }
    } catch (error) {
      console.error('Error in checkUserRegistration:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (formData: UserData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to register.",
        variant: "destructive"
      });
      return false;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('users')
        .insert({
          user_id: user.id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Error",
            description: "This email is already registered.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to save user information. Please try again.",
            variant: "destructive"
          });
        }
        return false;
      }

      setIsRegistered(true);
      setUserData(formData);
      
      toast({
        title: "Success",
        description: "User information saved successfully!",
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isRegistered,
    loading,
    userData,
    registerUser,
    checkUserRegistration
  };
};