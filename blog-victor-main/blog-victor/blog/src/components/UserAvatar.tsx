interface UserAvatarProps {
  name: string;
  image?: string | null;
  className?: string;
  fontSize?: string;
}

export function UserAvatar({ 
  name, 
  image, 
  className = "w-8 h-8", 
  fontSize = "text-xs" 
}: UserAvatarProps) {
  if (image) {
    return (
      <img 
        src={image} 
        alt={name} 
        className={`${className} rounded-full object-cover border border-gray-700`} 
      />
    );
  }
  
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white ${fontSize} font-bold flex-shrink-0 border border-gray-700`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

