import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface UserAvatarProps {
  user: any;
  profile?: any;
  className?: string;
  fallbackClassName?: string;
}
export function UserAvatar({
  user,
  profile,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  if (!user) return null;
  const initials = profile?.full_name
    ? profile.full_name
        .split("")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.substring(0, 2).toUpperCase() || "YA";
  return (
    <Avatar className={className}>
      {" "}
      <AvatarImage
        src={profile?.avatar_url || user.user_metadata?.avatar_url || ""}
      />{" "}
      <AvatarFallback className={fallbackClassName}>
        {initials}
      </AvatarFallback>{" "}
    </Avatar>
  );
}
