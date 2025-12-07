export interface BlogPost {
  id: number;
  date: string;
  link: string;
  title: {
    rendered: string;
  };
  excerpt?: {
    rendered: string;
  };
  content?: {
    rendered: string;
  };
  type?: string;
}

export interface NavItem {
  name: string;
  href: string;
}

export interface Project {
  title: string;
  role: string;
  description: string;
  size: 'large' | 'tall' | 'wide' | 'medium' | 'small';
}
