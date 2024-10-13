interface Portfolio {
  id: number
  file_name: string
}

export interface DashboardProps {
  data: PortfolioBrief[]
  onHover: (portfoil: Portfolio) => void
  openDeletePortfolioModal: () => void
  handleExport: (arg: number) => void
}

export interface PortfolioBrief {
  id: number
  file_name: string
  updated_at: string
  image: string | null
}

export interface Skill {
  id: number
  name: string
  category?: string
}

export interface Project {
  id: number
  name: string
  description: string
  image: File | null
  githubLink: string
  siteLink: string
  startDate: string
  endDate: string
  selectedTechStack: number[]
  readmeFile: File | null
}
