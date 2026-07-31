export const mockProfileData = {
  userProfile: {
    avatarUrl: '/assets/avatar.png',
    username: 'ARCHITECT_ZERO',
    role: 'LEAD DREAM-WEAVER / NEURAL SYSTEMS ARCHITECT',
    clearanceLevel: 'LEVEL_4_CLEARANCE',
    bio: 'Specializing in brutalist conceptualization and recursive AI synthesis. Currently optimizing vertex buffers for glass-heavy structures within Project_Chimera. Experience in dream-space constraint management and photon mapping for high-latency neural environments.',
    telemetry: {
      status: 'UPLINK_STABLE',
      location: 'SECTOR_7_NODES',
      uptime: '99.98%'
    }
  },

  telemetryStats: [
    { label: 'COMMITS_LOGGED', value: '12k+' },
    { label: 'SPRINTS_COMPLETED', value: '42' },
    { label: 'NODES_FOLLOWING', value: '8.4k' },
    { label: 'NEURAL_EFFICIENCY', value: 'TOP_0.1%' }
  ],

  productions: [
    {
      id: 'prod-1',
      title: 'Project_Chimera',
      description: 'Recursive AI engine for architectural dream-weaving.',
      bannerUrl: '/assets/chimera.png',
      status: 'ACTIVE',
      statusType: 'active',
      tags: ['Rust', 'v4.2.0', '3.2k ★']
    },
    {
      id: 'prod-2',
      title: 'Recursive_Styling',
      description: 'A library for high-clearance dashboard interfaces.',
      bannerUrl: '/assets/synergia.png',
      status: 'STABLE',
      statusType: 'stable',
      tags: ['TypeScript', 'v1.8.5', '842 ★']
    }
  ],

  productionLogs: [
    {
      id: 'log-1',
      timestamp: 'MAR_24 // 09:42',
      title: 'Merge: master <- lighting_rework',
      description: 'Refined photon mapping for glass shaders.',
      isActive: true
    },
    {
      id: 'log-2',
      timestamp: 'MAR_22 // 14:15',
      title: 'Fix: Recursive depth overflow',
      description: 'Resolved crash in brutalist mesh gen.',
      isActive: false
    },
    {
      id: 'log-3',
      timestamp: 'MAR_20 // 11:20',
      title: 'Initial Build: Core_v4',
      description: 'Baseline for Project_Chimera stable.',
      isActive: false
    }
  ],

  castCrew: [
    {
      id: 'crew-1',
      username: '0_Vargas',
      role: 'LEAD ARCHITECT',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'crew-2',
      username: 'A_Chen',
      role: 'SCRIPT DEBUGGER',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'crew-3',
      username: 'J_Doc_4',
      role: 'VISUAL OPS',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    {
      id: 'crew-4',
      username: 'N_Saito',
      role: 'NEURAL LEAD',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    }
  ],

  tmdbThemes: [
    {
      id: 'matrix',
      name: 'Matrix Green (TMDB #603)',
      colors: {
        '--bg': '#080d0a',
        '--surface': '#101914',
        '--accent': '#00ff66',
        '--border': '#1b3326',
        '--text': '#d0ffd8'
      }
    },
    {
      id: 'bladerunner',
      name: 'Blade Runner 2049 (TMDB #335984)',
      colors: {
        '--bg': '#0d0814',
        '--surface': '#1a1024',
        '--accent': '#ff0055',
        '--border': '#3d1b4d',
        '--text': '#fbe6ff'
      }
    },
    {
      id: 'dune',
      name: 'Dune: Part Two (TMDB #693134)',
      colors: {
        '--bg': '#120e08',
        '--surface': '#211910',
        '--accent': '#ffaa00',
        '--border': '#4a3820',
        '--text': '#fff3d6'
      }
    },
    {
      id: 'tron',
      name: 'Tron: Legacy (TMDB #20526)',
      colors: {
        '--bg': '#060e17',
        '--surface': '#0f1c2b',
        '--accent': '#00e5ff',
        '--border': '#1a425c',
        '--text': '#dcf8ff'
      }
    },
    {
      id: 'batman',
      name: 'The Dark Knight (TMDB #155)',
      colors: {
        '--bg': '#0a0e14',
        '--surface': '#131924',
        '--accent': '#3a86ff',
        '--border': '#1f2d42',
        '--text': '#e2e8f0'
      }
    }
  ]
};
