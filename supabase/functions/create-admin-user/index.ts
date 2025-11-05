import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreateAdminRequest {
  email: string;
  password: string;
  assignedBy?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { email, password, assignedBy }: CreateAdminRequest = await req.json();

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    console.log(`Creating admin user: ${email}`);

    // Create user with auto-confirm enabled
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        display_name: email.split('@')[0],
      },
    });

    if (createError) {
      console.error('Error creating user:', createError);
      throw createError;
    }

    if (!userData.user) {
      throw new Error('User creation failed - no user data returned');
    }

    console.log(`User created successfully: ${userData.user.id}`);

    // Get the assigned_by user ID (default to first admin if not provided)
    let assignedById = assignedBy;
    if (!assignedById) {
      const { data: existingAdmin } = await supabaseAdmin
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin')
        .limit(1)
        .single();
      
      assignedById = existingAdmin?.user_id || userData.user.id;
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'admin',
        assigned_by: assignedById,
        assigned_at: new Date().toISOString(),
      });

    if (roleError) {
      console.error('Error assigning admin role:', roleError);
      // Try to delete the user if role assignment fails
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      throw roleError;
    }

    console.log(`Admin role assigned successfully to ${email}`);

    // Log the admin creation action
    await supabaseAdmin.from('admin_audit_logs').insert({
      admin_user_id: assignedById,
      action: 'create_admin_user',
      target_table: 'auth.users',
      target_id: userData.user.id,
      new_values: {
        email: email,
        role: 'admin',
        created_via: 'edge_function',
      },
    });

    console.log(`Admin creation logged for ${email}`);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userData.user.id,
          email: userData.user.email,
          role: 'admin',
          confirmed: true,
        },
        message: `Admin user ${email} created successfully`,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in create-admin-user function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
