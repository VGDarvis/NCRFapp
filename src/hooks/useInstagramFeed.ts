import { useState, useEffect } from 'react';

export interface InstagramPost {
  id: string;
  thumbnail: string;
  link: string;
}

// Curated posts from @ncrfoundation
// Update these periodically with recent posts
const FEATURED_POSTS: InstagramPost[] = [
  {
    id: '1',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  },
  {
    id: '2',
    thumbnail: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  },
  {
    id: '3',
    thumbnail: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  },
  {
    id: '4',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  },
  {
    id: '5',
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  },
  {
    id: '6',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  },
  {
    id: '7',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  },
  {
    id: '8',
    thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  },
  {
    id: '9',
    thumbnail: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&h=400&fit=crop',
    link: 'https://www.instagram.com/ncrfoundation/'
  }
];

export const useInstagramFeed = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for smooth experience
    const timer = setTimeout(() => {
      setPosts(FEATURED_POSTS);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return { posts, isLoading };
};
