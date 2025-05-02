// supabase/functions/addNote/index.ts
/// <reference types="https://deno.land/std@0.177.0/http/server.d.ts" />

import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Create Supabase client with the Auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the user from the JWT
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError) {
      throw new Error(authError.message);
    }

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { title, content } = await req.json();

    if (!title || !content) {
      throw new Error('Title and content are required');
    }

    const { data, error: insertError } = await supabaseClient
      .from('notes')
      .insert([{ title, content, user_id: user.id }])
      .select();

    if (insertError) {
      throw new Error(insertError.message);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // Properly type the error
    const err = error instanceof Error ? error : new Error('Unknown error occurred');
    
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});