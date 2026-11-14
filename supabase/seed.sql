-- Supabase Seed: Initial Campus Locations
-- Generic seed entries as specified in Section 8

insert into public.campus_locations (name, is_active, sort_order)
values
  ('Library', true, 10),
  ('Student center', true, 20),
  ('Cafeteria', true, 30),
  ('Main quad', true, 40),
  ('Science building', true, 50),
  ('Arts building', true, 60),
  ('Sports center', true, 70),
  ('Residence halls', true, 80),
  ('Transit stop', true, 90),
  ('Other / exact location shared privately', true, 100)
on conflict (name) do update set
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;
