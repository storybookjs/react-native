import type { Meta, StoryObj } from '@storybook/react-native';
import { fn } from 'storybook/test';
import { UserProfileCard } from './UserProfileCard';

const meta = {
  title: 'UserProfileCard',
  component: UserProfileCard,
  args: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'Software Engineer',
    bio: 'Building beautiful user interfaces and crafting delightful experiences. React Native enthusiast.',
    verified: false,
    online: false,
    isFollowing: false,
    followers: 1234,
    following: 567,
    onPress: fn(),
    onFollowPress: fn(),
  },
  argTypes: {
    name: {
      control: 'text',
      description: "User's display name",
    },
    email: {
      control: 'text',
      description: "User's email address",
    },
    bio: {
      control: 'text',
      description: "User's bio or description",
    },
    role: {
      control: 'text',
      description: "User's role or title",
    },
    avatarUrl: {
      control: 'text',
      description: 'Avatar image URL',
    },
    verified: {
      control: 'boolean',
      description: 'Whether the user is verified',
    },
    online: {
      control: 'boolean',
      description: 'Whether the user is online',
    },
    isFollowing: {
      control: 'boolean',
      description: 'Whether following this user',
    },
    followers: {
      control: 'number',
      description: 'Number of followers',
    },
    following: {
      control: 'number',
      description: 'Number of following',
    },
  },
} satisfies Meta<typeof UserProfileCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAvatar: Story = {
  args: {
    name: 'Alex Johnson',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    role: 'Product Designer',
    bio: 'Passionate about creating intuitive and beautiful designs that solve real problems.',
  },
};

export const VerifiedUser: Story = {
  args: {
    name: 'Sarah Chen',
    verified: true,
    role: 'Senior Developer',
    followers: 15420,
    following: 892,
    bio: 'Open source contributor and tech blogger. Love sharing knowledge with the community.',
  },
};

export const OnlineUser: Story = {
  args: {
    name: 'Mike Williams',
    online: true,
    avatarUrl: 'https://i.pravatar.cc/150?img=33',
    role: 'DevOps Engineer',
  },
};

export const Following: Story = {
  args: {
    name: 'Emma Davis',
    isFollowing: true,
    verified: true,
    online: true,
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    role: 'Engineering Manager',
    followers: 8765,
    following: 234,
  },
};

export const MinimalCard: Story = {
  args: {
    name: 'John Smith',
    email: undefined,
    bio: undefined,
    role: undefined,
    onFollowPress: undefined,
  },
};

export const LongContent: Story = {
  args: {
    name: 'Dr. Elizabeth Montgomery-Whitfield III',
    email: 'elizabeth.montgomery.whitfield@longcompanyname.example.com',
    role: 'Chief Technology Officer & Head of Innovation',
    bio: 'With over 20 years of experience in software development, I specialize in building scalable distributed systems, leading cross-functional teams, and driving digital transformation initiatives across global organizations.',
    followers: 125000,
    following: 45,
    verified: true,
  },
};

export const PopularUser: Story = {
  args: {
    name: 'Tech Influencer',
    avatarUrl: 'https://i.pravatar.cc/150?img=68',
    verified: true,
    online: true,
    role: 'Content Creator',
    bio: '🚀 Sharing daily tech tips and coding tutorials. Join 1M+ developers learning to code!',
    followers: 1250000,
    following: 127,
  },
};
