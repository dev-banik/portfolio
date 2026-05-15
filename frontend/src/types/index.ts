export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Profile {
  id: string;
  fullName: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  yearsOfExperience: number;
  projectsCompleted: number;
  happyClients: number;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  codeforcesUrl?: string;
  leetcodeUrl?: string;
  githubUsername?: string;
  isAvailableForHire: boolean;
  availabilityNote?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string;
  ogImageUrl?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon?: string;
  displayOrder: number;
  isActive: boolean;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  percentage: number;
  icon?: string;
  color?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  categoryId: string;
  categoryName: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  companyLogoUrl?: string;
  companyUrl?: string;
  location: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  techStack?: string;
  techStackList: string[];
  displayOrder: number;
  isActive: boolean;
}

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  institutionLogoUrl?: string;
  institutionUrl?: string;
  location: string;
  cgpa?: number;
  maxCgpa?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  activities?: string;
  displayOrder: number;
  isActive: boolean;
}

export interface ProjectCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  projectCount: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  thumbnailUrl?: string;
  imageUrls: string[];
  liveUrl?: string;
  githubUrl?: string;
  techStack?: string;
  techStackList: string[];
  isFeatured: boolean;
  status: string;
  startDate?: string;
  endDate?: string;
  displayOrder: number;
  viewCount: number;
  categoryId?: string;
  categoryName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  displayOrder: number;
  isActive: boolean;
  blogCount: number;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  readTimeMinutes: number;
  metaTitle: string;
  metaDescription: string;
  categoryId?: string;
  categoryName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issuerLogoUrl?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  issuedDate: string;
  expiryDate?: string;
  doesNotExpire: boolean;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  clientAvatarUrl?: string;
  clientLinkedinUrl?: string;
  content: string;
  rating: number;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
}

export interface NavigationMenu {
  id: string;
  label: string;
  href: string;
  icon?: string;
  isExternal: boolean;
  displayOrder: number;
  isVisible: boolean;
  parentId?: string;
  children: NavigationMenu[];
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface Section {
  id: string;
  key: string;
  title: string;
  subtitle?: string;
  description?: string;
  isVisible: boolean;
  displayOrder: number;
}

export interface SiteConfig {
  id: string;
  key: string;
  value: string;
  description?: string;
  group: string;
  dataType: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatarUrl?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUser;
}
