import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLACE_ID = "ChIJ96F8qlABThMR_aXSC53eBDA"; // <- paste your Place ID here

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY");

    if (!GOOGLE_PLACES_API_KEY) {
      console.error("GOOGLE_PLACES_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }



    // Fetch place details + reviews using the fixed Place ID
    const detailsUrl =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(PLACE_ID)}` +
      `&fields=name,rating,reviews,user_ratings_total` +
      `&key=${GOOGLE_PLACES_API_KEY}`;

    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== "OK") {
      console.error("Error fetching place details:", detailsData);
      return new Response(
        JSON.stringify({ error: detailsData.status || "Places API error" }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }

    const result = detailsData.result || {};

    const reviews =
      result.reviews?.slice(0, 3).map((review: any) => ({
        id: review.time,
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        date: review.relative_time_description,
      })) ?? [];

    const responseBody = {
      reviews,
      totalRating: result.rating ?? null,
      totalReviews: result.user_ratings_total ?? 0,
      name: result.name ?? null,
    };

    return new Response(JSON.stringify(responseBody), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in fetch-google-reviews function:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});
