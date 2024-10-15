export interface DashboardProps {
  data: PortfolioBrief[]
  onHover: (portfolio: { id: number; file_name: string }) => void
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

export interface ProjectInputProps {
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

export interface Project {
  id: number
  name: string
  description: string
  githubLink?: string
  siteLink?: string
  startDate: string
  endDate: string
  image?: string
  readmeFile?: string
  skills: number[]
}

export interface Portfolio {
  portfolioName: string
  title: string
  description: string
  githubLink: string
  blogLink: string
  image: string
  skills: number[]
  projects: Project[]
}

export interface User {
  name: string
  email: string
  birthdate: string
}

export interface PortfolioViewPageProps {
  portfolioData: Portfolio
  userData: User
}
