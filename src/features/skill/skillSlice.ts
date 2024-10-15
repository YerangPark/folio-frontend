import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://yrpark.duckdns.org:8080'

// SECTION: 스킬 데이터 API 요청
export const fetchSkills = createAsyncThunk('skill/fetchSkills', async () => {
  const response = await fetch(`${apiUrl}/api/skills`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const res = await response.json()
  return res.data.skills
})

const skillSlice = createSlice({
  name: 'skill',
  initialState: {
    skills: [] as { id: number; name: string; category: string }[],
    status: 'idle', // NOTE: for lodaing status
    error: null as string | null,
  },
  reducers: {},
  // NOTE: extraReducers는 비동기적인 상태 업데이트에 사용된다.
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.skills = action.payload // DB로부터 가져온 스킬 데이터를 상태에 저장
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Unknown error occurred'
      })
  },
})

export default skillSlice.reducer
