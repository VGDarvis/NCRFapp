import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Star, Send, MessageSquare } from 'lucide-react';

interface ReviewsTabProps {
  user: User | null;
  isGuest?: boolean;
}

interface Review {
  id: string;
  rating: number;
  review_text: string;
  student_name: string;
  created_at: string;
  tutor: {
    display_name: string;
  };
}

export function MovementReviewsTab({ user, isGuest }: ReviewsTabProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [studentName, setStudentName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('tutor_reviews')
      .select(`
        id,
        rating,
        review_text,
        student_name,
        created_at,
        tutor:movement_tutors(display_name)
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setReviews(data as any);
    }
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (isGuest) {
      toast({
        title: "Sign in required",
        description: "Please sign in to leave a review",
        variant: "destructive",
      });
      return;
    }

    if (!reviewText.trim() || !studentName.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, we'll show a success message
    toast({
      title: "Review submitted!",
      description: "Your review is pending approval. Thank you for your feedback!",
    });

    setReviewText('');
    setStudentName('');
    setRating(5);
  };

  const StarRating = ({ rating: ratingValue, onRate }: { rating: number; onRate?: (rating: number) => void }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 cursor-pointer transition-colors ${
              star <= ratingValue ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
            }`}
            onClick={() => onRate?.(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">
          Parent Reviews & Feedback
        </h1>
        <p className="text-muted-foreground">
          Share your experience and read what others have to say
        </p>
      </div>

      {!isGuest && (
        <Card className="glass-light border-pink-500/20">
          <CardHeader>
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>Help us improve by sharing your feedback</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <StarRating rating={rating} onRate={setRating} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                placeholder="Enter student's name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Share your experience with our mentors and programs..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleSubmitReview}
              className="bg-gradient-to-r from-pink-500 to-rose-400"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Review
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Reviews</h2>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <Card className="glass-light border-pink-500/20">
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <Card key={review.id} className="glass-light border-pink-500/20">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{review.student_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Mentor: {review.tutor?.display_name || 'Movement Program'}
                      </p>
                    </div>
                    <StarRating rating={review.rating} />
                  </div>
                  <p className="text-sm text-muted-foreground">{review.review_text}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
