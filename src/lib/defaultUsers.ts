import { supabase } from './supabase';

export async function createDefaultUsers() {
  const defaultUsers = [
    {
      email: 'superuser@mailcreak.com',
      password: 'SuperPass123!',
      metadata: {
        username: 'superuser',
        first_name: 'Super',
        last_name: 'User',
        phone_number: '+1234567890',
        role: 'superuser'
      }
    },
    {
      email: 'admin@mailcreak.com',
      password: 'AdminPass123!',
      metadata: {
        username: 'admin',
        first_name: 'Admin',
        last_name: 'User',
        phone_number: '+1234567891',
        role: 'admin'
      }
    },
    {
      email: 'user@mailcreak.com',
      password: 'UserPass123!',
      metadata: {
        username: 'user',
        first_name: 'Regular',
        last_name: 'User',
        phone_number: '+1234567892',
        role: 'user'
      }
    }
  ];

  for (const user of defaultUsers) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: user.metadata
        }
      });

      if (error) {
        console.error(`Failed to create user ${user.email}:`, error.message);
        continue;
      }

      if (data.user) {
        // Update the profile with the role
        await supabase
          .from('profiles')
          .update({ role: user.metadata.role })
          .eq('id', data.user.id);
      }
    } catch (error) {
      console.error(`Error creating user ${user.email}:`, error);
    }
  }
}