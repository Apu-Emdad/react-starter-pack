import dayjs from 'dayjs';

export const formatDate = (value: string | Date): string => {
  return dayjs(value).format('DD MMM YYYY');
};

export const getInitials = (name: string): string => {
  return name.slice(0, 2).toUpperCase();
};

/** Same user name always gets the same avatar gradient. */
const AVATAR_GRADIENTS: [string, string][] = [
  ['#4F46E5', '#C026D3'],
  ['#0EA5E9', '#6366F1'],
  ['#F59E0B', '#EF4444'],
  ['#10B981', '#0EA5E9'],
  ['#EC4899', '#8B5CF6'],
];

export const getAvatarGradient = (name: string): string => {
  const sum = [...name].reduce((total, char) => total + char.charCodeAt(0), 0);
  const [from, to] = AVATAR_GRADIENTS[sum % AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${from}, ${to})`;
};
