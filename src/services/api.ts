export const api = {
  auth: { login: async (c: any) => ({ token: 'mock-token', user: { id: 'u1', role: 'student' } }) },
  student: { getProfile: async () => ({}) },
  assessment: { getList: async () => [] },
  talentPool: { getStudents: async () => [] },
  jobs: { getList: async () => [] },
  pipeline: { getApplications: async () => [] },
  school: { getStudents: async () => [] },
  admin: { getUsers: async () => [] }
};