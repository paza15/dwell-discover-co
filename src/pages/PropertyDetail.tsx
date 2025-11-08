import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
}

const GoogleReviews = () => {
  const {
    data: reviewsData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["google-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-google-reviews");
      if (error) {
        console.error("fetch-google-reviews error:", error);
        throw error;
      }
      return data as {
        reviews: Review[];
        totalRating: number | null;
        totalReviews: number;
      };
    },
    staleTime: 1000 * 60 * 60,
  });

  const reviews = reviewsData?.reviews || [];
  const hasStats =
    typeof reviewsData?.totalRating === "number" &&
    typeof reviewsData?.totalReviews === "number";

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    console.error("GoogleReviews query error:", error);
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            Could not load Google reviews right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-muted-foreground text-lg">
            {hasStats
              ? `${reviewsData!.totalReviews} Google reviews • ${reviewsData!.totalRating!.toFixed(
                1
              )} ⭐`
              : "Google reviews"}
          </p>
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                        }`}
                    />
                  ))}
                </div>
                <p className="text-foreground mb-4 line-clamp-4">{review.text}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">
                    {review.author}
                  </span>
                  <span className="text-muted-foreground">{review.date}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No Google reviews available yet.
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="https://www.google.com/search?q=ideal+properties+shkoder"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            See all reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
};
