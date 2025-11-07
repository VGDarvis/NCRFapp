import { supabase } from "@/integrations/supabase/client";

const EVENT_ID = "df8a7c6b-5e4d-3c2b-1a0f-9e8d7c6b5a4f";
const VENUE_ID = "ea9f8b3c-4d2e-4f5a-9c7d-8e2f1a3b4c5d";
const EVENT_DATE = "2025-11-08";

async function ensureRoomExists(roomName: string, venueId: string) {
  const { data: existingRoom } = await supabase
    .from("seminar_rooms")
    .select("id")
    .eq("room_name", roomName)
    .eq("venue_id", venueId)
    .maybeSingle();

  if (existingRoom) {
    return existingRoom.id;
  }

  const { data: newRoom, error } = await supabase
    .from("seminar_rooms")
    .insert({
      venue_id: venueId,
      room_name: roomName,
    })
    .select("id")
    .single();

  if (error) throw error;
  return newRoom.id;
}

export async function seedDallasSeminars() {
  try {
    // Create rooms
    const cafeteriaRoomId = await ensureRoomExists("Cafeteria", VENUE_ID);
    const room1309Id = await ensureRoomExists("ROOM 1309", VENUE_ID);
    const room1311Id = await ensureRoomExists("ROOM 1311", VENUE_ID);

    // Prepare all seminars
    const seminars = [
      // Cafeteria Seminars
      {
        event_id: EVENT_ID,
        room_id: cafeteriaRoomId,
        title: "How to Think & Grow Rich-The ABCs of $$$",
        start_time: `${EVENT_DATE}T10:45:00`,
        end_time: `${EVENT_DATE}T11:30:00`,
        category: "financial_aid",
        registration_required: false,
      },
      {
        event_id: EVENT_ID,
        room_id: cafeteriaRoomId,
        title: "Booming Careers-How to Find your Dream Job",
        presenter_name: "Denise Parker",
        presenter_title: "NCRF Manager",
        presenter_organization: "Internships & Careers",
        start_time: `${EVENT_DATE}T11:30:00`,
        end_time: `${EVENT_DATE}T12:15:00`,
        category: "career",
        registration_required: false,
      },
      {
        event_id: EVENT_ID,
        room_id: cafeteriaRoomId,
        title: "How to Start a Business & Maintain It",
        presenter_name: "Denise Parker",
        presenter_title: "NCRF Director",
        presenter_organization: "Entrepreneurship Academy",
        start_time: `${EVENT_DATE}T12:15:00`,
        end_time: `${EVENT_DATE}T13:00:00`,
        category: "career",
        registration_required: false,
      },
      {
        event_id: EVENT_ID,
        room_id: cafeteriaRoomId,
        title: "Dallas Mavericks Presents 'Careers in Sports'",
        presenter_name: "Derek Speight",
        presenter_title: "NCRF TV Host",
        start_time: `${EVENT_DATE}T13:15:00`,
        end_time: `${EVENT_DATE}T14:00:00`,
        category: "career",
        registration_required: false,
      },
      // Room 1309 Seminars
      {
        event_id: EVENT_ID,
        room_id: room1309Id,
        title: "How to Find Money for College-Financial Aid, Scholarships",
        presenter_organization: "NCRF College & Careers Team",
        start_time: `${EVENT_DATE}T11:00:00`,
        end_time: `${EVENT_DATE}T11:45:00`,
        category: "financial_aid",
        registration_required: false,
      },
      {
        event_id: EVENT_ID,
        room_id: room1309Id,
        title: "411 for the Student Athlete",
        presenter_organization: "NCRF Student Athlete Program Team",
        start_time: `${EVENT_DATE}T11:45:00`,
        end_time: `${EVENT_DATE}T12:30:00`,
        category: "general",
        registration_required: false,
      },
      // Room 1311 Seminars
      {
        event_id: EVENT_ID,
        room_id: room1311Id,
        title: "Why Attend an HBCU",
        presenter_name: "Ameer Walton",
        presenter_title: "Author",
        presenter_organization: "My Historically Black Purpose",
        start_time: `${EVENT_DATE}T11:00:00`,
        end_time: `${EVENT_DATE}T11:45:00`,
        category: "college_selection",
        registration_required: false,
      },
      {
        event_id: EVENT_ID,
        room_id: room1311Id,
        title: "Hip Hop Legend YoYo teaches you 'How to Get A's in English'",
        start_time: `${EVENT_DATE}T13:00:00`,
        end_time: `${EVENT_DATE}T13:45:00`,
        category: "general",
        registration_required: false,
      },
    ];

    // Insert all seminars
    const { data, error } = await supabase
      .from("seminar_sessions")
      .insert(seminars)
      .select();

    if (error) throw error;

    console.log(`Successfully created ${data.length} seminars`);
    return { success: true, count: data.length };
  } catch (error) {
    console.error("Error seeding Dallas seminars:", error);
    throw error;
  }
}
