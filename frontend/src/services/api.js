const API_BASE_URL = '/api';

/**
 * Fetch cinematic profile by GitHub username
 * @param {string} username 
 */
export async function fetchCinematicProfile(username) {
  try {
    console.log(`📡 [API FUSION] Requesting GitHub profile API for @${username}...`);
    const res = await fetch(`${API_BASE_URL}/cinematic/profile/${encodeURIComponent(username)}`, {
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const data = await res.json();
    
    // Explicit Console Log of GitHub API Data for User Inspection
    console.group(`🚀 [API FUSION] GITHUB API RESPONSE FOR @${username}`);
    console.log('👤 GITHUB USER PROFILE:', data.userProfile);
    console.log('📦 GITHUB REPOSITORIES:', data.repos);
    console.log('🎬 TMDB MOVIE THEME:', data.currentTheme);
    console.log('👥 CAST & CREW (CONTRIBUTORS):', data.castCrew);
    console.log('📄 FULL JSON RESPONSE:', data);
    console.groupEnd();

    return data;
  } catch (err) {
    console.error('❌ [API FUSION] Error fetching cinematic profile:', err);
    throw err;
  }
}

/**
 * Search GitHub repos via backend
 * @param {string} query 
 */
export async function searchGitHubRepos(query) {
  try {
    const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, {
      credentials: 'include'
    });
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const results = await res.json();
    console.log(`🔎 [API FUSION] SEARCH RESULTS FOR "${query}":`, results);
    return results;
  } catch (err) {
    console.error('❌ [API FUSION] Error searching repos:', err);
    return [];
  }
}
