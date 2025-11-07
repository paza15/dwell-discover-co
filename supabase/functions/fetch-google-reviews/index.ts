import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!GOOGLE_PLACES_API_KEY) {
      console.error('GOOGLE_PLACES_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // First, get the place ID using Find Place from Text
    const findPlaceUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=iDeal+Properties+Shkodër&inputtype=textquery&fields=place_id&key=${GOOGLE_PLACES_API_KEY}`;
    
    const findPlaceResponse = await fetch(findPlaceUrl);
    const findPlaceData = await findPlaceResponse.json();
    
    if (!findPlaceData.candidates || findPlaceData.candidates.length === 0) {
      console.error('Place not found');
      return new Response(
        JSON.stringify({ error: 'Place not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const placeId = findPlaceData.candidates[0].place_id;
    console.log('Found place ID:', placeId);

    // Now get the place details including reviews
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews,user_ratings_total&key=${GOOGLE_PLACES_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.status !== 'OK') {
      console.error('Error fetching place details:', detailsData.status);
      return new Response(
        JSON.stringify({ error: detailsData.status }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const reviews = detailsData.result.reviews?.slice(0, 3).map((review: any) => ({
      id: review.time,
      author: review.author_name,
      rating: review.rating,
      text: review.text,
      date: review.relative_time_description
    })) || [];

    return new Response(
      JSON.stringify({ 
        reviews,
        totalRating: detailsData.result.rating,
        totalReviews: detailsData.result.user_ratings_total
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in fetch-google-reviews function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
