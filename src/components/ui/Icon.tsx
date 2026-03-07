// FD-032: Icon system wrapper around lucide-react

import type { LucideProps } from "lucide-react";

export {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Plus,
  Minus,
  Search,
  Menu,
  Settings,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Info,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Copy,
  Trash2,
  Edit2,
  Star,
  Heart,
  Bell,
  LogOut,
} from "lucide-react";

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export type IconSize = keyof typeof sizeMap;

export interface IconProps extends Omit<LucideProps, "size"> {
  icon: React.ComponentType<LucideProps>;
  size?: IconSize;
}

export function Icon({ icon: LucideIcon, size = "md", className, ...props }: IconProps) {
  return <LucideIcon size={sizeMap[size]} className={className} {...props} />;
}
