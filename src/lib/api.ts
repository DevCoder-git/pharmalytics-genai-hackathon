// Mock API client for demonstration purposes
export const apiClient = {
  async login(username: string, password: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    if (username && password) {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            username,
            email: username + '@example.com',
            role: 'patient', // Default role
            profile: {
              licenseNumber: null,
              specialization: null,
              hospitalAffiliation: null,
              verificationStatus: 'pending'
            }
          }
        }
      };
    }
    
    return {
      success: false,
      error: 'Invalid credentials'
    };
  },

  async register(username: string, email: string, password: string, role: string) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Mock successful registration
    if (username && email && password && role) {
      return {
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 1,
            username,
            email,
            role,
            profile: {
              licenseNumber: null,
              specialization: null,
              hospitalAffiliation: null,
              verificationStatus: 'pending'
            }
          }
        }
      };
    }
    
    return {
      success: false,
      error: 'Registration failed'
    };
  },

  async checkDrugInteraction(drug1: string, drug2: string) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock drug interaction response
    const interactions = [
      {
        severity: 'high',
        description: 'May increase bleeding risk when taken together',
        recommendation: 'Monitor closely and consider dose adjustment'
      },
      {
        severity: 'moderate', 
        description: 'May affect drug absorption',
        recommendation: 'Take medications 2 hours apart'
      }
    ];
    
    return {
      success: true,
      data: {
        hasInteraction: Math.random() > 0.3,
        interaction: interactions[Math.floor(Math.random() * interactions.length)],
        confidence: Math.floor(Math.random() * 40) + 60
      }
    };
  },

  async analyzeText(text: string, analysisType: string) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      data: {
        extractedDrugs: ['Lisinopril', 'Atorvastatin', 'Metformin'],
        confidence: 0.92,
        analysisType,
        warnings: ['Check for drug allergies', 'Monitor liver function']
      }
    };
  },

  async translateText(text: string, targetLanguage: string) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const translations = {
      'es': 'Texto traducido al español',
      'fr': 'Texte traduit en français',
      'de': 'Ins Deutsche übersetzter Text'
    };
    
    return {
      success: true,
      data: {
        translatedText: translations[targetLanguage as keyof typeof translations] || 'Translated text',
        confidence: 0.95,
        sourceLanguage: 'en'
      }
    };
  },

  // Additional mock methods for compatibility
  async checkDrugInteractions(medications: any[], patientAge?: number) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      data: {
        interactions: medications.length > 1 ? [
          {
            severity: 'moderate',
            description: 'Potential interaction detected between medications',
            recommendation: 'Monitor patient closely'
          }
        ] : [],
        riskLevel: Math.random() > 0.5 ? 'moderate' : 'low'
      }
    };
  },

  async getDosageRecommendation(drugName: string, patientAge: number, patientWeight?: number, medicalConditions: string[] = []) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return {
      success: true,
      data: {
        recommendedDose: '10mg daily',
        frequency: 'Once daily',
        adjustments: patientAge > 65 ? ['Reduce dose by 50% in elderly patients'] : [],
        warnings: ['Monitor liver function', 'Check for drug allergies']
      }
    };
  },

  async extractFromText(text: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        medications: ['Lisinopril', 'Atorvastatin'],
        dosages: ['10mg', '20mg'],
        frequencies: ['daily', 'once daily'],
        confidence: 0.89
      }
    };
  },

  async analyzeSideEffects(medications: any[], patientProfile: any = {}) {
    await new Promise(resolve => setTimeout(resolve, 700));
    
    return {
      success: true,
      data: {
        riskScore: Math.floor(Math.random() * 100),
        commonSideEffects: ['Dizziness', 'Fatigue', 'Nausea'],
        severeSideEffects: ['Liver damage', 'Allergic reaction'],
        recommendations: ['Monitor liver function', 'Watch for allergic reactions']
      }
    };
  },

  async getProfile() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const user = localStorage.getItem('user');
    if (user) {
      return {
        success: true,
        data: JSON.parse(user)
      };
    }
    
    return {
      success: false,
      error: 'User not found'
    };
  },

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};