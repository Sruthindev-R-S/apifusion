/**
 * @fileoverview Service for user-related database operations.
 */

// You would configure and export this from a separate config file
// const { createClient } = require('@supabase/supabase-js');
// const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/**
 * A service class for managing users.
 */
class UserService {
  /**
   * Finds a user by their GitHub ID or creates a new one.
   * In a real application, this would interact with a database like Supabase.
   * @param {object} githubProfile - The profile object from GitHub.
   * @returns {Promise<object>} The user from the database.
   */
  async findOrCreate(githubProfile) {
    console.log(`Finding or creating user for GitHub ID: ${githubProfile.id}`);
    // This is a placeholder. Replace with your actual Supabase client.
    const supabase = { from: () => ({ select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'PGRST116' } }) }) }), insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: { id: 'new-db-id-456' } }) }) }) }) };

    const { data: user, error } = await supabase.from('users').select('*').eq('github_id', githubProfile.id).single();

    // If user is found, return it.
    if (user) {
      console.log('User found in DB.');
      return user;
    }

    // If the error is anything other than "no rows found", throw it.
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // If user is not found, create a new one.
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        github_id: githubProfile.id,
        username: githubProfile.username,
        avatar_url: githubProfile._json.avatar_url,
        name: githubProfile.displayName,
      })
      .select()
      .single();

    if (createError) throw createError;

    console.log('New user created in DB.');
    return newUser;
  }
}

module.exports = new UserService();